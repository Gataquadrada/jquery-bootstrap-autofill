;(function ($) {
    $.fn.autofill = function (options = {}) {
        const defaults = {
            autofillSelection: true,
            itemsLimit: 5,
            values: [],
            datasetURL: "",
            datasetMethod: "GET",
            datasetPostData: {},
            datasetHeaders: {},
            datasetFormatting: null,
            minCharacters: 3,
            minDelay: 250,
            onLoading: null,
            onUpdate: null,
            onSelect: null,
            onEmpty: null,
            onError: null,
            darkMode: false,
            fullWidth: true,
        }

        const settings = $.extend(defaults, options)

        return this.each(function () {
            /*
             * ELEMENTS
             */
            const elem = $(this)
                .attr("autocomplete", "off")
                .addClass("autofill-input")
            const container = $(`<div class="dropdown"></div>`)
            const list = $(
                `<ul class="dropdown-menu ${
                    settings.darkMode ? "dropdown-menu-dark" : ""
                } autofill-dropdown-menu" ${
                    settings.fullWidth ? `style="width:100%"` : ""
                }></ul>`
            )

            container.insertAfter(elem)
            elem.appendTo(container) //.attr("data-bs-toggle", "dropdown")
            list.appendTo(container)

            /*
             * DATA HOLDERS
             */
            const suggest = new Map()
            const found = new Set()
            var previousValue = ""

            /*
            * LOCAL SETTINGS FROM THE ELEMENT ITSELF
            + Being able to rewrite the global settings of the selector is just an extra
            */
            settings.datasetURL = elem.data("autofill-dataseturl")
                ? elem.data("autofill-dataseturl").toString()
                : settings.datasetURL.toString()

            settings.datasetMethod = elem.data("autofill-datasetmethod")
                ? elem.data("autofill-datasetmethod").toString()
                : settings.datasetMethod.toString()

            settings.itemsLimit =
                (elem.data("autofill-itemslimit") &&
                NaN !== parseInt(elem.data("autofill-itemslimit")) &&
                parseInt(elem.data("autofill-itemslimit")).toString() ===
                    elem.data("autofill-itemslimit").toString() &&
                0 < parseInt(elem.data("autofill-itemslimit"))
                    ? parseInt(elem.data("autofill-itemslimit"))
                    : 5) ||
                parseInt(settings.itemsLimit) ||
                5

            settings.autofillSelection =
                undefined !== elem.data("autofill-autofillselection")
                    ? Boolean(elem.data("autofill-autofillselection"))
                    : settings.autofillSelection

            settings.values =
                undefined !== elem.data("autofill-values")
                    ? elem.data("autofill-values").split("|")
                    : settings.values

            elem.__autofillUpdate = function () {
                list.removeClass("show").empty()

                if (
                    !elem.val().trim() ||
                    elem.val().trim().length < settings.minCharacters
                ) {
                    return null
                }

                if (found.size) {
                    found.forEach((v) => {
                        const item = $(
                            `<li><a class="dropdown-item" href="#">${v.id.replace(
                                new RegExp(`(${elem.val()})`, "gmi"),
                                "<strong>$1</strong>"
                            )}</a></li>`
                        )

                        item.on("click", function (e) {
                            e.preventDefault()
                            e.stopImmediatePropagation()

                            list.removeClass("show")

                            if (settings.autofillSelection) {
                                elem.val(v.id)
                            } else {
                                elem.val("")
                            }

                            elem.trigger("focus").trigger(
                                "autofill-selected",
                                v
                            )

                            if (
                                typeof function () {} ===
                                typeof settings.onSelect
                            ) {
                                settings.onSelect(v, item)
                            }
                        })

                        list.append(item)
                    })
                } else {
                    const item = $(
                        `<li><a class="dropdown-item disabled" href="#">${$.fn.autofill.lang.emptyTable}</a></li>`
                    )

                    item.on("click", function (e) {
                        e.preventDefault()
                        list.removeClass("show")
                        elem.trigger("focus")
                    })

                    list.append(item)

                    elem.trigger("autofill-empty", list)

                    if (typeof function () {} === typeof settings.onEmpty) {
                        settings.onEmpty(item)
                    }
                }

                elem.trigger("autofill-update", list)

                if (typeof function () {} === typeof settings.onUpdate) {
                    settings.onUpdate(list)
                }

                list.addClass("show")
            }

            elem.__timers = {}

            if (settings.values.length) {
                $.each(settings.values, function (i, v) {
                    suggest.set(v, v)
                })
            }

            elem.on("keyup", function (e) {
                if ("ArrowUp" == e.key || "ArrowDown" == e.key) {
                    if ("ArrowUp" == e.key) {
                        if (
                            !list.find("a.active").length ||
                            list.find(":first-child > a.active").length
                        ) {
                            list.find("a.active").removeClass("active")
                            list.find(":last-child > a").addClass("active")
                        } else {
                            list.find("a.active")
                                .addClass("active-previous")
                                .parent()
                                .prev()
                                .find("a")
                                .addClass("active")

                            list.find(".active-previous").removeClass(
                                "active active-previous"
                            )
                        }
                    } else if ("ArrowDown" == e.key) {
                        if (
                            !list.find("a.active").length ||
                            list.find(":last-child > a.active").length
                        ) {
                            list.find("a.active").removeClass("active")
                            list.find(":first-child > a").addClass("active")
                        } else {
                            list.find("a.active")
                                .addClass("active-previous")
                                .parent()
                                .next()
                                .find("a")
                                .addClass("active")

                            list.find(".active-previous").removeClass(
                                "active active-previous"
                            )
                        }
                    }

                    return null
                } else if (
                    ("Enter" == e.key || "Return" == e.key) &&
                    list.find("a.active").length
                ) {
                    list.find("a.active").trigger("click")
                    return null
                } else if ("Esc" == e.key || "Escape" == e.key) {
                    list.removeClass("show")
                    return null
                }

                const text = elem.val()

                list.removeClass("show")

                try {
                    clearInterval(elem.__timers)
                } catch (tErr) {}

                if (
                    !text.trim() ||
                    text.trim().length < settings.minCharacters
                ) {
                    return null
                }

                if (previousValue.trim() == text.trim()) {
                    list.addClass("show")
                    return null
                }

                previousValue = text.trim()

                found.clear()

                if (settings.datasetURL) {
                    // TBA
                    found.clear()
                    elem.trigger("autofill-loading")

                    elem.__timers = setTimeout(() => {
                        $.ajax({
                            url: settings.datasetURL,
                            method: settings.datasetMethod,
                            data:
                                typeof function () {} ===
                                typeof settings.datasetPostData
                                    ? settings.datasetPostData()
                                    : settings.datasetPostData,
                            dataType: "JSON",
                            headers: $.extend(
                                {
                                    Accept: "application/json",
                                },
                                settings.datasetHeaders
                            ),
                            cache: false,
                        })
                            .then((data) => {
                                if (
                                    typeof function () {} ===
                                    typeof settings.datasetFormatting
                                ) {
                                    data = settings.datasetFormatting(data)
                                }

                                $.each(data, (i, v) => {
                                    found.add({
                                        id: i,
                                        object: v,
                                    })
                                })

                                elem.__autofillUpdate()
                            })
                            .catch((a, b, c) => {
                                console.error(a)
                                console.error(b)
                                console.error(c)

                                elem.trigger("autofill-error", a, b, c)

                                if (
                                    typeof function () {} ===
                                    typeof settings.onError
                                ) {
                                    settings.onError(a, b, c)
                                }
                            })
                    }, settings.minDelay)
                } else {
                    suggest.forEach((v) => {
                        if (settings.itemsLimit <= found.size) {
                            return null
                        }

                        if (
                            v.toLowerCase() !== text.toLowerCase() &&
                            v.toLowerCase().includes(text.toLowerCase())
                        ) {
                            found.add({
                                id: v,
                                object: v,
                            })
                        }
                    })

                    elem.__autofillUpdate()
                }
            })

            /*
            * LOADING EVENT
            - Triggered during AJAX calls
            */
            elem.on("autofill-loading", function () {
                const item = $(
                    `<li><a class="dropdown-item disabled" href="#">${$.fn.autofill.lang.processing}</a></li>`
                )

                item.on("click", function (e) {
                    e.preventDefault()
                    list.removeClass("show")
                    elem.trigger("focus")
                })

                list.empty().append(item).addClass("show")

                if (typeof function () {} === typeof settings.onLoading) {
                    settings.onLoading(item)
                }
            })
        })
    }

    $.fn.autofill.lang = {
        emptyTable: "Nothing to suggest...",
        processing: "Processing...",
    }
})(jQuery)
