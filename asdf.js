(function ($) {
  var container = samo.initModuleContainer("search_tour");
  var price_url = null;
  var _ROOT_URL = samo.ROOT_URL;
  var $module_container = container;
  samo.search_tour = function () {
    var DOLOAD =
      parseInt($.getParameter("DOLOAD", true, $module_container)) == 1;
    var _controls = samo.cache_controls(
      $module_container,
      ".STATEFROM,.STATEINC,.TOWNFROMINC,.TOURINC,.PROGRAMGROUPINC,.PROGRAMINC,.TOWNS,.HOTELS,.STARS,.MEALS,.ROOMS,.CURRENCY,.NIGHTS_FROM,.NIGHTS_TILL,.ADULT,.CHILD,.FILTER,.FREIGHT,.MOMENT_CONFIRM,.CHILD_IN_BED,.COMFORTABLE_SEATS,.COSTMIN,.COSTMAX,.CHECKIN_BEG,.CHECKIN_END,.HOTELSSEL,.TOURTYPE,.TOURGROUP,.FREIGHTTYPE,.TOWNS_ANY,.STARS_ANY,.HOTELS_ANY,.MEALS_ANY,.ROOMS_ANY,.hotelsearch,input[name=embed],.UFILTER,.WITHOUT_PROMO"
    );
    var chosenControls =
      ".TOWNFROMINC,.STATEFROM,.STATEINC,.TOURGROUP,.TOURTYPE,.TOURINC,.PROGRAMGROUPINC,.PROGRAMINC," +
      ".NIGHTS_FROM,.NIGHTS_TILL,.ADULT,.CHILD,.CURRENCY,.FREIGHTTYPE";
    $(this)
      .find("option")
      .each(function () {
        if ($(this).attr("data-search-string")) {
          $(this).attr(
            "data-search-string",
            $(this).attr("data-search-string") +
              " " +
              $(this).attr("data-search-string").fixKeyboardLayout()
          );
        }
      });
    $(_controls.PROGRAMINC)
      .find("option")
      .each(function () {
        const title = this.text;
        const translit = title.translit();
        $(this).attr(
          "data-search-string",
          title +
            " " +
            translit +
            " " +
            title.fixKeyboardLayout() +
            " " +
            translit.fixKeyboardLayout()
        );
      });
    $(chosenControls).each(function () {
      var disable_search = true,
        chosenEl;
      if (
        $(this).hasClass("TOWNFROMINC") ||
        $(this).hasClass("STATEFROM") ||
        $(this).hasClass("STATEINC") ||
        $(this).hasClass("TOURGROUP") ||
        $(this).hasClass("TOURTYPE") ||
        $(this).hasClass("TOURINC") ||
        $(this).hasClass("PROGRAMGROUPINC") ||
        $(this).hasClass("FREIGHTTYPE") ||
        $(this).hasClass("PROGRAMINC")
      ) {
        disable_search = false;
      }
      $(this).chosen({
        enable_split_word_search: false,
        search_contains: true,
        disable_search: disable_search,
      });
      chosenEl = $(this).parent().find(".chosen-container");
      chosenEl.addClass($(this).attr("name") + "_chosen");
      chosenEl.css("text-align", "left").css("width", "100%");
    });
    var $resultset = (_controls.resultset =
      $module_container.find(".resultset"));
    _controls.resultsetGrouped = $module_container.find(".resultsetGrouped");
    $.event.trigger("ajaxStart");
    var items = {},
      HOTELS = _controls.HOTELS;
    $(HOTELS)
      .find("input")
      .each(function (i) {
        var el = $(this),
          $gs = $.map(
            String(el.data("group-star")).split(","),
            function (e, i) {
              return parseInt(e);
            }
          ),
          $types = $.map(String(el.data("type")).split(","), function (e, i) {
            return parseInt(e);
          });
        var item = {
          inc: parseInt(this.value),
          title:
            " " +
            el
              .parent()
              .text()
              .toLowerCase()
              .replace(/[\x01-\x1F|*]/g, " ")
              .trim(),
          town: parseInt(el.data("town")),
          GroupStarList: $gs,
          HotelTypeList: $types,
          ref: el.parent().get(0),
        };
        el.removeData("town").removeData("group-star").removeData("type");
        items[i] = item;
      });
    $.data($(HOTELS).get(0), "items", items);
    $module_container.find(".checklistbox :checked").each(function () {
      if (!this.defaultChecked) {
        this.checked = false;
      }
    });
    $.event.trigger("ajaxStop");
    samo.price_helpers($module_container);
    var $prev_url = getParams("");
    $module_container
      .find("input.date")
      .datePicker()
      .end()
      .find("input.price")
      .numeric()
      .SpinButton({
        step: 100,
        min: 0,
        max: 10000000,
      })
      .end()
      .find(".STATEFROM,.TOWNFROMINC,.STATEINC")
      .on("change", function () {
        if (0 != $(this).val()) {
          $module_container
            .find(".TOWNFROMINC,.STATEINC")
            .find('option[value="0"]')
            .remove();
        }
        $module_container
          .find(".TOWNS_ANY,.MEALS_ANY,.STARS_ANY,.HOTELS_ANY")
          .prop("checked", true)
          .end()
          .find(".TOWNS,.MEALS,.STARS,.HOTELS")
          .empty()
          .end()
          .find(".HOTELSSEL")
          .empty()
          .removeClass("shown")
          .end()
          .find(".TOURINC,.PROGRAMGROUPINC,.PROGRAMINC,.TOURTYPE,.TOURGROUP")
          .find("option")
          .remove();
      })
      .end()
      .find(".TOURTYPE,.TOURGROUP,.TOURINC")
      .on("change", function () {
        if ($(this).not(".TOURINC").length > 0) {
          $module_container.find(".TOURINC").val(0);
        }
        $module_container
          .find(".TOWNS_ANY,.HOTELS_ANY")
          .prop("checked", true)
          .end()
          .find(".TOWNS,.HOTELS")
          .empty();
      })
      .end()
      .find(".HOTELS_SEL")
      .on("click", function () {
        hotels_show(!this.checked);
      })
      .end()
      .find(
        ".STATEFROM,.TOWNFROMINC,.STATEINC,.TOURTYPE,.TOURGROUP,.TOURINC,.PROGRAMGROUPINC,.PROGRAMINC,.ADULT,.CHILD,.COMFORTABLE_SEATS"
      )
      .on("change", function () {
        var name = this.name || $(this).attr("name");
        setTimeout(function () {
          if ("ADULT" != name && "CHILD" != name) {
            reset_hotels_filter();
          }
          if (name == "STATEFROM") {
            $module_container.find(".TOWNFROMINC").val(0);
            $module_container.find(".STATEINC").val(0);
          }
          if (
            name != "STATEINC" ||
            $.controlValue(name, false, $module_container)
          ) {
            $.getScript(
              getParams(name),
              function () {
                $prev_url = getParams("");
                samo.blink_element();
              },
              true
            );
          }
        }, 0);
      });
    $(_controls.HOTELS).on("click", function (e) {
      var srcElement = e.target.tagName.toUpperCase();
      var $label =
        srcElement == "LABEL"
          ? $(e.target)
          : srcElement == "INPUT"
          ? $(e.target).parent()
          : false;
      if ($label) {
        var $input = $label.find("input");
        var checked = $input.is(":checked");
        var $show_selected = $module_container.find(".HOTELS_SEL");
        if ("LABEL" == srcElement) {
          $input.get(0).checked = checked = !checked;
          e.preventDefault();
          e.stopPropagation();
        }
        var selected_count = $module_container.find(
          ".HOTELS input:checked"
        ).length;
        if ($show_selected.is(":checked")) {
          if (!checked) {
            $label.addClass("hidden");
          }
          if (selected_count == 0) {
            $show_selected.prop("checked", false);
            hotels_filter();
          }
        }
        $module_container
          .find(".HOTELS_ANY")
          .prop("checked", !checked && selected_count == 0);
        if (_controls.HOTELSSEL) {
          var $el = $label.clone();
          $(_controls.HOTELSSEL).append($el).addClass("shown");
          $label.addClass("sel");
        }
      }
    });
    $(_controls.HOTELSSEL).on("click", "label", function () {
      var $input = $(this).find("input"),
        $sel = $(_controls.HOTELSSEL);
      $(HOTELS)
        .find("input[value=" + $input.val() + "]")
        .prop("checked", false)
        .parent()
        .removeClass("sel");
      $(this).remove();
      if (!$sel.find("input").length) {
        $sel.removeClass("shown");
        $module_container.find(".HOTELS_ANY").prop("checked", true);
      }
    });
    $module_container
      .find(".STARS,.TOWNS")
      .on("click", "input", function () {
        var $groupbox = $(this).parents("div.groupbox");
        if ($groupbox.length) {
          if ($(this).is(".group")) {
            var inputs = $groupbox
              .find("input")
              .not(".group")
              .prop("checked", this.checked)
              .parents("label");
            if (this.checked) {
              inputs.removeClass("hidden");
              if (inputs.length > 1) {
                inputs.find("input").addClass("semiselected");
              }
            } else {
              inputs.addClass("hidden");
              if (inputs.length > 1) {
                inputs.find("input").removeClass("semiselected");
              }
            }
          } else {
            var $all = $groupbox.find("input").not(".group");
            if ($(this).is(".semiselected")) {
              $groupbox
                .find(".semiselected")
                .removeClass("semiselected")
                .prop("checked", false);
              $(this).prop("checked", true);
            }
            var checked = $all.filter(":checked").length;
            if ($all.length == checked || checked == 0) {
              $groupbox.find("input.group").prop("checked", checked > 0);
              if (0 == checked) {
                $groupbox.find("label").not(".groupname").addClass("hidden");
              }
            }
          }
        }
        hotels_filter();
        var $towns = $(this).parents(".TOWNS");
        if ($towns.length) {
          $.getScript(
            getParams("TOWNS"),
            function () {
              $prev_url = getParams("");
              samo.blink_element();
            },
            true
          );
        }
      })
      .end()
      .find(".MEALS,.ROOMS,.UFILTER")
      .checklistbox()
      .end()
      .find(".CURRENCY")
      .on("change", function () {
        var $currency_to = $(this).val();
        $module_container
          .find("input[name=COSTMAX],input[name=COSTMIN]")
          .each(function () {
            if ($(this).val()) {
              var exrate =
                $(this).data("currency") != $currency_to
                  ? samo.CROSS_RATES[$(this).data("currency")][$currency_to]
                  : 1;
              var newValue = Math.ceil(
                parseInt($(this).data("value")) * exrate
              );
              newValue = isNaN(newValue) ? "" : newValue;
              $(this).val(newValue).triggerHandler("blur");
            }
          });
      })
      .end()
      .find("input[name=COSTMAX],input[name=COSTMIN]")
      .on("blur", function () {
        var currency = $module_container
            .find(".CURRENCY option:selected")
            .val(),
          value = $(this).val();
        $(this).data("value", value).data("currency", currency);
      })
      .end()
      .find(".CHECKIN_BEG")
      .on("change.datepicker", function () {
        $(_controls.CHECKIN_END).val(this.value);
      })
      .end()
      .find(".CHECKIN_BEG, .CHECKIN_END")
      .on("change.datepicker", function (e) {
        if (e.namespace === "datepicker") {
          var name = this.name || $(this).attr("name");
          var $nights = $module_container.find(".NIGHTS_TILL, .NIGHTS_FROM");
          $nights.prop("disabled", true).trigger("chosen:updated");
          $.getScript(
            getParams(name),
            function () {
              samo.blink_element();
              $nights
                .prop("disabled", false)
                .trigger("chosen:updated")
                .trigger("chosen:activate");
            },
            true
          );
        }
      })
      .end()
      .find(".NIGHTS_FROM")
      .on("change", function () {
        $(_controls.NIGHTS_TILL).val(this.value);
        $(_controls.NIGHTS_TILL).trigger("chosen:updated");
      })
      .end()
      .find(".NIGHTS_TILL")
      .on("change", function () {
        if (parseInt(this.value) < parseInt(_controls.NIGHTS_FROM.value)) {
          $(_controls.NIGHTS_FROM).val(this.value);
          $(_controls.NIGHTS_FROM).trigger("chosen:updated");
        }
      })
      .end()
      .find(".CHILD")
      .on("draw_child_ages", function () {
        var $childAges = $module_container.find(".child_ages");
        if (this.value > 0 && this.value <= 3) {
          $childAges.css("visibility", "visible");
          var chDestroy = [];
          for (var $i = 1; $i <= 3; $i++) {
            if ($i <= this.value) {
              $module_container
                .find(".age_" + $i)
                .css("visibility", "visible")
                .chosen({
                  enable_split_word_search: false,
                  search_contains: true,
                  disable_search: true,
                })
                .parent()
                .find(".chosen-container:eq(" + ($i - 1) + ")")
                .css("width", "53px");
            } else {
              $module_container.find(".age_" + $i).css("visibility", "hidden");
              if (
                $module_container
                  .find(".age_" + $i)
                  .parent()
                  .find(".chosen-container:eq(" + ($i - 1) + ")").length
              ) {
                chDestroy.push($i);
              }
            }
          }
          for (var i = 0; i < chDestroy.length; i++) {
            $module_container.find(".age_" + chDestroy[i]).chosen("destroy");
          }
        } else {
          $childAges
            .css("visibility", "hidden")
            .find(".age")
            .css("visibility", "hidden");
        }
      })
      .on("change", function () {
        $(this).triggerHandler("draw_child_ages");
      })
      .end()
      .find(".hotelsearch")
      .on("keyup", function (e) {
        if (e.keyCode == 27) {
          $(this).trigger("clearSearch");
          e.stopPropagation();
          return;
        }
        $module_container.find(".HOTELS_SEL").data("checked", false);
        hotels_filter();
      })
      .on("mouseup", function () {
        var $input = $(this),
          oldValue = $input.val();
        if (oldValue == "") {
          return;
        }
        setTimeout(function () {
          var newValue = $input.val();
          if (newValue == "") {
            $input.trigger("clearSearch");
          }
        });
      })
      .on("clearSearch", function () {
        this.value = "";
        hotels_filter();
      });
    $module_container
      .find(".child_ages .age")
      .numeric(" ")
      .attr("title", samo.i18n("CHILD_AGES"));
    if (_controls.CHILD.value > 0) {
      $(_controls.CHILD).triggerHandler("change");
    }
    $module_container.find(".load").on("click", getPrices);
    $(_controls.CURRENCY).on("change", price_page_url);
    $module_container
      .find(".hotels_container .checklistbox")
      .on("mouseover", "label", function () {
        var $label = $(this),
          text;
        if (typeof $label.attr("title") == "undefined") {
          text = $label.text().trim();
          text = text.length > 15 ? text : "";
          $label.attr("title", text);
        }
      });
    function getPrices() {
      if (!samo.checkStateAndTownfrom($module_container)) {
        return false;
      }
      if ($.controlValue("ADULT") + $.controlValue("CHILD") == 0) {
        $.notify({
          text: samo.i18n("CHOOSE_PEOPLE_COUNT"),
          type: "error",
        });
        return false;
      }
      if (samo.MODULE != "search_wohotel") {
        if (
          parseInt($.controlValue("NIGHTS_FROM")) +
            parseInt($.controlValue("NIGHTS_TILL")) ==
          0
        ) {
          $.notify({
            text: samo.i18n("NO_NIGHTS"),
            type: "error",
          });
          return false;
        }
        if (
          $(HOTELS).find("input:checked").length == 0 &&
          $(HOTELS).find("label").not(".hidden").length == 0
        ) {
          $.notify({
            text: samo.i18n("NO_HOTEL"),
            type: "error",
          });
          return false;
        }
      }
      $.getScript(price_page_url() + "1", true);
    }
    function price_page_url() {
      price_url = getParams("PRICES") + "&PRICEPAGE=";
      return price_url;
    }
    function getParams(action) {
      var useGET = arguments[1] || false;
      var returnObj = arguments[2] || false;
      var params = {};
      params.samo_action = action;
      $.each(_controls, function (i, v) {
        var name = v.name || $(v).attr("name");
        if (!name) {
          return;
        }
        if (
          $.inArray(action, [
            "TOWNFROMINC",
            "STATEINC",
            "FREIGHTTYPE",
            "TOURTYPE",
            "TOURGROUP",
            "TOURINC",
            "PROGRAMGROUPINC",
            "PROGRAMINC",
            "ADULT",
            "CHILD",
            "CHECKIN_BEG",
            "CHECKIN_END",
          ]) == -1 ||
          $.inArray(name, [
            "STATEFROM",
            "TOWNFROMINC",
            "STATEINC",
            "FREIGHTTYPE",
            "TOURTYPE",
            "TOURGROUP",
            "TOURINC",
            "PROGRAMGROUPINC",
            "PROGRAMINC",
            "NIGHTS_FROM",
            "NIGHTS_TILL",
            "ADULT",
            "CHILD",
            "COMFORTABLE_SEATS",
            "CHECKIN_BEG",
            "CHECKIN_END",
            "CHILD",
            "embed",
          ]) != -1
        ) {
          if (
            action == "TOWNFROMINC" &&
            $.inArray(name, [
              "STATEINC",
              "TOURINC",
              "PROGRAMGROUPINC",
              "PROGRAMINC",
              "TOURTYPE",
              "TOURGROUP",
            ]) + 1
          ) {
            return;
          } else if (
            action == "STATEINC" &&
            $.inArray(name, [
              "TOURINC",
              "PROGRAMGROUPINC",
              "PROGRAMINC",
              "TOURTYPE",
              "TOURGROUP",
            ]) + 1
          ) {
            return;
          } else if (
            $.inArray(action, ["FREIGHTTYPE"]) + 1 &&
            $.inArray(name, ["TOURINC", "TOURGROUP"]) + 1
          ) {
            return;
          } else if (
            $.inArray(action, ["TOURTYPE", "TOURGROUP"]) + 1 &&
            $.inArray(name, ["TOURINC", "PROGRAMGROUPINC", "PROGRAMINC"]) + 1
          ) {
            return;
          } else if (action == "TOURINC" && name == "TOURINC") {
            samo.gdsHotelParamsTill($.controlValue(v, useGET));
          }
          if (name == "COSTMAX" || name == "COSTMIN") {
            var val = $.controlValue(v, useGET);
            if (val) {
              params[name] = val;
            }
          } else {
            params[name] = $.controlValue(v, useGET);
          }
        }
      });
      if (
        $.inArray(action, [
          "TOWNFROMINC",
          "STATEINC",
          "FREIGHTTYPE",
          "TOURINC",
          "PROGRAMGROUPINC",
          "PROGRAMINC",
          "TOURTYPE",
          "TOURGROUP",
          "ADULT",
          "CHILD",
          "COMFORTABLE_SEATS",
          "CHECKIN_BEG",
          "CHECKIN_END",
        ]) < 0
      ) {
        var stars = [],
          hoteltypes = [];
        $module_container
          .find(".STARS")
          .find("input:checked")
          .each(function () {
            if ($(this).is(".star")) {
              stars.push(parseInt($(this).val()));
            } else {
              if ($(this).is(".hoteltype")) {
                hoteltypes.push(parseInt($(this).val()));
              }
            }
          });
        params.STARS = stars.join(",");
        params.HOTELTYPES = hoteltypes.join(",");
        if (!params.MEALS) {
          var meal = $.getParameter("MEALINC", 1, $module_container);
          if (meal) {
            params.MEALINC = meal;
          }
        }
        if (!params.ROOMS) {
          var room = $.getParameter("ROOMINC", 1, $module_container);
          if (room) {
            params.ROOMINC = room;
          }
        }
        if (params.CHILD > 0 && params.CHILD <= 3) {
          var ages = [],
            age = 0;
          for (var idx = 1; idx <= params.CHILD; idx++) {
            age = $module_container
              .find(".child_ages")
              .find(".age_" + idx)
              .val();
            ages.push(parseInt(age));
          }
          params.AGES = ages
            .sort(function (a, b) {
              return a - b;
            })
            .join(",");
        }
        var partPriceEl = $module_container.find("input.PARTITION_PRICE");
        var partPrice = partPriceEl.prop("checked") ? partPriceEl.val() : null;
        params.PARTITION_PRICE = partPrice;
      }
      if (typeof params.HOTELS != "undefined" && params.HOTELS.length) {
        delete params.STARS;
        delete params.STARS_ANY;
        delete params.HOTELSSEL;
        delete params.TOWNS;
        delete params.TOWNS_ANY;
        delete params.HOTELTYPES;
      }
      return returnObj ? params : _ROOT_URL + $.param(params);
    }
    samo.gdsHotelParamsTill = function (selVal) {
      var hidetill;
      var tourinc = $.controlValue("TOURINC", true);
      selVal = typeof selVal != "undefined" ? selVal : tourinc ? tourinc : 0;
      if (selVal > 0) {
        hidetill = $(samo.controls.TOURINC)
          .find('option[value="' + selVal + '"]')
          .is(".gds.hotel");
      }
      if (typeof hidetill == "undefined") {
        hidetill = false;
        var $options = $(samo.controls.TOURINC).find("option");
        var $totalTours = $options.not('[value="0"]'),
          t = $totalTours.length;
        if (t > 0) {
          var $gdsHotelTours = $totalTours.filter(".gds.hotel"),
            l = $gdsHotelTours.length;
          if (l == t) {
            hidetill = true;
          }
        }
      }
      $module_container
        .find(".paramsFrom .description")
        .html(
          samo.i18n(
            hidetill
              ? samo.MODULE == "search_hotel"
                ? "THE_BEST_CHECKIN"
                : "FREIGHT_DATE_RESULT"
              : samo.MODULE == "search_hotel"
              ? "TOUR_HOTEL_CHECKIN_FROM"
              : "TOUR_SEARCH_CHECKIN_FROM"
          )
        );
      $module_container
        .find(".paramsFrom .description2")
        .html(
          samo.i18n(hidetill ? "TOUR_SEARCH_NIGHTS" : "TOUR_SEARCH_NIGHTS_FROM")
        );
      $module_container.find(".paramsTill").css({
        visibility: hidetill ? "hidden" : "visible",
      });
      if (hidetill) {
        $(_controls.CHECKIN_END).val($(_controls.CHECKIN_BEG).val());
        $(_controls.NIGHTS_TILL).val($(_controls.NIGHTS_FROM).val());
      }
    };
    $(samo.controls.TOURINC).on("chosen:updated", function () {
      samo.gdsHotelParamsTill(this.value);
    });
    samo.price_clickable($module_container);
    $resultset.on("click", "span.page", function () {
      $.getScript(price_url + $(this).data("page"), true);
    });
    samo.initResultset = function () {
      var $legend = $module_container.find(".price_legend").show();
      var $scrollTo = $module_container.find("#scrollto");
      var offset = ($scrollTo.length ? $scrollTo : $legend).offset();
      window.scrollTo(offset.left, offset.top);
      $resultset.on("mouseover", "span", function () {
        var $self = $(this);
        if ($self.is(".recommend"))
          $self.attr("title", samo.i18n("TOUR_SEARCH_PRICE_RECOMENDED"));
        if ($self.is(".vip"))
          $self.attr("title", samo.i18n("TOUR_SEARCH_PRICE_VIP"));
        if ($self.is(".best"))
          $self.attr("title", samo.i18n("TOUR_SEARCH_PRICE_THE_BEST"));
        if ($self.is(".surcharge"))
          $self.attr("title", samo.i18n("TOUR_SEARCH_PRICE_SURCHARGE"));
        if ($self.is(".surchargeIn"))
          $self.attr("title", samo.i18n("TOUR_SEARCH_PRICE_SURCHARGE_IN"));
        if ($self.is(".surchargeOut"))
          $self.attr("title", samo.i18n("TOUR_SEARCH_PRICE_SURCHARGE_OUT"));
      });
      if (samo.ROUTES.all_prices) {
        $("table.res").on("click", "span.all_prices", function () {
          var params = {},
            $data = $(this).parents("tr:first").data();
          params.TOWNFROMINC = $data.townfrom;
          params.STATEINC = $data.state;
          params.CATCLAIM = $data.catClaim;
          params.STATEFROM = $data.statefrom;
          params.CURRENCY = $(_controls.CURRENCY).val();
          window.open(
            samo.ROUTES.all_prices.url + $.param(params),
            "all_prices" + params.HOTELINC
          );
        });
      }
      $(_controls.resultset)
        .find("table.res")
        .on("click", "span.additional", function () {
          var params = {
              samo_action: "CONTENT",
            },
            $data = $(this).parents("tr:first").data();
          params.TOWNFROMINC = $data.townfrom;
          params.STATEINC = $data.state;
          params.CATCLAIM = $data.catClaim;
          params.STATEFROM = $data.statefrom;
          if (_controls.embed) {
            params.embed = $(_controls.embed).val();
          }
          $.getScript(_ROOT_URL + $.param(params));
        })
        .on("click", "span.percent", function () {
          var params = {
              samo_action: "COMMISSIONS",
            },
            $data = $(this).parents("tr:first").data();
          params.TOWNFROMINC = $data.townfrom;
          params.STATEINC = $data.state;
          params.CATCLAIM = $data.catClaim;
          params.STATEFROM = $data.statefrom;
          params.CURRENCY = $(_controls.CURRENCY).val();
          if (_controls.embed) {
            params.embed = $(_controls.embed).val();
          }
          $.getScript(_ROOT_URL + $.param(params));
        })
        .on("click", "span", function () {
          var $self = $(this),
            params = {},
            $tr = $self.parents("tr:first"),
            $trdata = $tr.data();
          params.CATCLAIM = $trdata.catClaim;
          params.STATEFROM = $trdata.statefrom;
          if (
            $tr.is(".stats") &&
            ($self.is(".stats") ||
              $self.is(".fr_place_l") ||
              $self.is(".fr_place_r") ||
              $self.is(".hotel_availability"))
          ) {
            params.samo_action = "STATS";
            params.TOWNFROMINC = $trdata.townfrom;
            params.STATEINC = $trdata.state;
            params.CURRENCY = $(_controls.CURRENCY).val();
            $.getScript(_ROOT_URL + $.param(params), function () {
              if (typeof google == "undefined") {
                $.require("//www.gstatic.com/charts/loader.js", function () {
                  google.charts.load("current", {
                    packages: ["corechart", "bar"],
                    language: samo.LANG.locale,
                  });
                  google.charts.setOnLoadCallback(samo.googlePriceChart);
                });
              } else {
                samo.googlePriceChart();
              }
              samo.helpalt_field($("#search_stat"), "hover");
              $("#freights .show_boarding").on("click", function () {
                var selector = ".boarding_" + $(this).attr("data-id");
                var $selector = $(selector);
                if ($selector.css("display") == "none") {
                  var params = {};
                  params.samo_action = "BOARDING";
                  params.BOARDING = $(this).attr("data-key");
                  params.SELECTOR = selector;
                  $.getScript(_ROOT_URL + $.param(params));
                } else {
                  $selector.find(".content").empty();
                  $selector.hide();
                }
              });
            });
          }
        })
        .on("click", ".btn-group", function () {
          var resultsetGrouped = $(_controls.resultsetGrouped);
          var $self = $(this);
          var $parent = $self.parents("tr:first");
          if ($self.hasClass("rotating")) {
            $self.removeClass("rotating");
            while ($parent.next().hasClass("dark")) {
              $parent.next().remove();
            }
          } else {
            $self.addClass("rotating");
            $.getScript(overGetParams($parent.data()), function () {
              $parent.after(resultsetGrouped.html());
              samo.helpalt_field($parent.parent(), "hover");
              resultsetGrouped.html("");
            });
          }
        })
        .on("click", ".expand", function () {
          var $self = $(this);
          var $parent = $self.parents("tr:first");
          $parent.find(".btn-group").click();
        });
      samo.helpalt_field(container, "hover");
      if (samo.ROUTES.favorites) {
        samo.favorites();
      }
    };
    var overGetParams = function overGetParams(data) {
      var params = getParams("PRICESGROUP", false, true);
      params.NIGHTS_FROM = data.nights;
      params.NIGHTS_TILL = data.nights;
      params.HOTELS = data.hotel;
      params.HOTELS_ANY = 0;
      params.PARTITION_PRICE = 0;
      params.SHOW_THEBEST = 0;
      params.STATEFROM = data.statefrom;
      params.CATCLAIM = data.catClaim;
      return _ROOT_URL + $.param(params);
    };
    const hotels_filter = function () {
      let categoryList = [],
        townList = [],
        typeList = [],
        anyTown = false;
      $module_container.find(".HOTELS_SEL").prop("checked", false);
      const towns_any = $module_container.find(".TOWNS_ANY").get(0);
      const category_any = $module_container.find(".STARS_ANY").get(0);
      const hotels = $(HOTELS).data("items");
      $(_controls.TOWNS)
        .find("input:checked")
        .each(function () {
          townList.push(parseInt(this.value));
        });
      anyTown = towns_any.checked = !townList.length;
      $module_container
        .find(".STARS")
        .find("input:checked")
        .each(function () {
          const $categoryItem = $(this);
          if ($categoryItem.is(".star")) {
            categoryList.push(parseInt(this.value));
          } else {
            if ($categoryItem.is(".hoteltype")) {
              typeList.push(parseInt(this.value));
            }
          }
        });
      category_any.checked = !categoryList.length && !typeList.length;
      const filterString = $(_controls.hotelsearch).val().trim().toLowerCase(),
        filterLength = filterString.length;
      let translitString = "",
        fklString = "",
        fklTranslitString = "";
      if (filterString && filterLength > 1) {
        translitString = filterString.translit();
        fklString = filterString.fixKeyboardLayout().toLowerCase();
        fklTranslitString = translitString.fixKeyboardLayout().toLowerCase();
      }
      $.each(hotels, function (idx, hotel) {
        let found = anyTown || $.inArray(hotel.town, townList) !== -1;
        if (found && categoryList.length) {
          found = false;
          $.each(hotel.GroupStarList, function (_idx, category) {
            if ($.inArray(category, categoryList) !== -1) {
              found = true;
              return false;
            }
          });
        }
        if (found && typeList.length) {
          found = typeList.every(function (a) {
            return hotel.HotelTypeList.indexOf(a) !== -1;
          });
        }
        if (found && filterLength) {
          const hotelTitle = hotel.title;
          found = hotelTitle.indexOf(filterString) > 0;
          if (!found && translitString.length) {
            found = hotelTitle.indexOf(translitString) > 0;
          }
          if (!found && fklString.length) {
            found = hotelTitle.indexOf(fklString) > 0;
          }
          if (!found && fklTranslitString.length) {
            found = hotelTitle.indexOf(fklTranslitString) > 0;
          }
        }
        const label = hotel.ref;
        if (found) {
          label.classList.remove("hidden");
        } else {
          label.classList.add("hidden");
        }
      });
    };
    var reset_hotels_filter = function () {
      $module_container.find(".TOWNS_ANY,.STARS_ANY").each(function () {
        this.checked = true;
        var name = this.name.replace(/_ANY/, "");
        $module_container.find("." + name + " :checked").prop("checked", false);
      });
      $(_controls.hotelsearch).val("");
    };
    var hotels_show = function (show_all) {
      show_all = show_all || false;
      if (show_all) {
        hotels_filter();
      } else {
        reset_hotels_filter();
        var $hotels = $(_controls.HOTELS).find("input");
        $hotels.each(function () {
          this.parentNode.className = this.checked ? "shown" : "hidden";
        });
      }
    };
    samo.price_chart = function () {
      samo.price_clickable($("#chart-info"));
      var $chart = $("#chart");
      if (!$chart.length) {
        return;
      }
      var $charttip = $("#chart-tip"),
        $span = $charttip.find("span"),
        $chart_line_current = $("#chart-line-current");
      var $fixTop = 85,
        $fixLeft = 106;
      var $selected = $chart.find("img.blue_row");
      if ($selected.length) {
        var y =
          parseInt($selected.attr("height")) +
          parseInt($("#tr_chart_days").height()) +
          parseInt($("#tr_chart_months").height());
        y += 6;
        $chart_line_current.css({
          display: "block",
          left: $fixLeft + 16,
          top: -y,
        });
        var $parent_selected = $selected.parent();
        var data = $parent_selected.data();
        var bron = $parent_selected.hasClass("bron");
        $("#chart-info table.res td.td_price .price").each(function () {
          $(this).html(data.price);
          if (bron) {
            $(this).addClass("bron").addClass("price_button");
          } else {
            $(this).removeClass("bron").removeClass("price_button");
          }
        });
      }
      $chart
        .on("mouseover", "td.info", function () {
          var $img = $(this).find("img");
          var positions = $img.addClass("hover").position(),
            tip = "",
            data = $(this).data(),
            diffint = parseInt(data.diff);
          var diff =
            diffint == 0 || data.price == 0
              ? ""
              : diffint > 0
              ? ' <span class="plus">+' + data.diff + "</span>"
              : ' <span class="minus">' + data.diff + "</span>";
          var price = data.price == 0 ? "" : data.price;
          tip += "<b>" + data.datebeg + "</b><br>" + price + diff + "<br>";
          if ($img.is(".red_row")) {
            tip +=
              '<span class="red_row">' +
              samo.i18n("TOUR_SEARCH_STOPSALE") +
              "</span>";
          } else if ($img.is(".green_row")) {
            tip +=
              '<span class="green_row">' +
              samo.i18n("TOUR_SEARCH_MOMENT_CONFIRM") +
              "</span>";
          } else if ($img.is(".pink_row")) {
            tip +=
              '<span class="pink_row">' +
              samo.i18n("TOUR_SEARCH_NO_TRANSPORT") +
              "</span>";
          } else {
            tip += "&nbsp;";
          }
          $span.html(tip);
          $charttip.css({
            display: "block",
            top: positions.top - $fixTop,
            left: positions.left - $fixLeft,
          });
        })
        .on("mouseout", "td.info", function () {
          $(this).find("img").removeClass("hover");
          $charttip.css({
            display: "none",
          });
        })
        .on("click", "td.refresh", function () {
          var $self = $(this);
          var $data = $self.data();
          var $data_info = $("#chart-info").data();
          var params = {};
          params.TOWNFROMINC = $data_info.townfrom;
          params.STATEINC = $data_info.state;
          params.CATCLAIM = $data.catClaim;
          params.CURRENCY = $data_info.currency;
          params.samo_action = "STATS";
          $.getScript(_ROOT_URL + $.param(params));
        });
    };
    samo.show_boarding = function (selector, html) {
      var $selector = $(selector);
      $selector.find(".content").html(html);
      $selector.css({
        display: "table-row",
      });
      samo.frplacement();
    };
    $module_container.find(".FREIGHTTYPE").on("change", function () {
      $.getScript(
        getParams("FREIGHTTYPE"),
        function () {
          $prev_url = getParams("");
          samo.blink_element();
        },
        true
      );
    });
    var do_filter = false;
    $module_container
      .find(".TOWNS_ANY,.STARS_ANY,.HOTELS_ANY,.MEALS_ANY,.ROOMS_ANY")
      .on("click", function () {
        var name = this.name.replace(/_ANY/, "");
        if (this.checked) {
          $module_container
            .find("." + name + " input:checked")
            .prop("checked", false);
          if (name == "HOTELS") {
            $(_controls.hotelsearch).val("");
            $module_container.find(".HOTELS_SEL").prop("checked", false);
            $(_controls.HOTELSSEL).removeClass("shown").empty();
            $(_controls.HOTELS).find(".sel").removeClass("sel");
          }
          if (name == "TOWNS") {
            $module_container
              .find(".TOWNS label")
              .not(".groupname")
              .addClass("hidden");
          }
          hotels_filter();
          if (name == "TOWNS") {
            $.getScript(
              getParams("TOWNS"),
              function () {
                $prev_url = getParams("");
                samo.blink_element();
              },
              true
            );
          }
        } else {
          if (
            0 == $module_container.find("." + name + " input:checked").length
          ) {
            this.checked = true;
          }
        }
      })
      .each(function () {
        var name = this.name.replace(/_ANY/, "");
        this.checked = !$module_container.find("." + name + " input:checked")
          .length;
        if (!do_filter && !this.checked && name != "MEALS" && name != "ROOMS") {
          hotels_filter();
          do_filter = true;
        }
      });
    $(".searchmodes .searchmode .searchmode_button").on(
      "mousedown keypress",
      function () {
        $(this).attr("href", click_search(this));
      }
    );
    $(".modern_search").on("click", function () {
      $(this).attr("href", click_search(this));
    });
    function click_search(self) {
      var $self = $(self),
        $parent = $self.parent(),
        params = {};
      if (!$self.data("origHref")) {
        $self.data("origHref", self.href);
      }
      if ("ticket" == $parent.data("searchmode")) {
        params["CHILD"] = $.controlValue(
          _controls["CHILD"],
          false,
          $module_container
        );
        params["ADULT"] = $.controlValue(
          _controls["ADULT"],
          false,
          $module_container
        );
        params["CURRENCYINC"] = $.controlValue(
          _controls["CURRENCY"],
          false,
          $module_container
        );
        params["CHECKIN"] = $.controlValue(
          _controls["CHECKIN_BEG"],
          false,
          $module_container
        );
        var checkin = samo.dateFromString(
          $.controlValue(_controls["CHECKIN_BEG"], false, $module_container),
          "yyyymmdd"
        );
        var checkout = new Date();
        checkout.setTime(checkin.getTime());
        checkout.setDate(
          checkin.getDate() +
            $.controlValue(_controls["NIGHTS_FROM"], false, $module_container)
        );
        params["CHECKOUT"] = samo.dateAsString(checkout, "yyyymmdd");
        params["FREIGHTBACK"] = 1;
        params["YESPLACES"] =
          typeof _controls["FREIGHT"] != "undefined"
            ? $.controlValue(_controls["FREIGHT"], false, $module_container)
            : 1;
      } else {
        $.each(_controls, function (i, v) {
          var name = v.name || $(v).attr("name");
          if (!name) {
            return;
          }
          if (
            $.inArray(name, [
              "STATEINC",
              "TOWNFROMINC",
              "TOURINC",
              "INCOMINGPARTNER",
            ]) == -1
          ) {
            if (name == "COSTMAX" || name == "COSTMIN") {
              var val = $.controlValue(v, false);
              if (val) {
                params[name] = val;
              }
            } else {
              params[name] = $.controlValue(v, false);
            }
          }
        });
        var stars = [],
          hoteltypes = [];
        $module_container.find(".STARS input:checked").each(function () {
          if ($(this).is(".star")) {
            stars.push(parseInt($(this).val()));
          } else {
            if ($(this).is(".hoteltype")) {
              hoteltypes.push(parseInt($(this).val()));
            }
          }
        });
        if (stars.length) {
          params.STARS = stars.join(",");
        }
        if (hoteltypes.length) {
          params.HOTELTYPES = hoteltypes.join(",");
        }
        if (!params.MEALS) {
          var meal = $.getParameter("MEALINC", 1, $module_container);
          if (meal) {
            params.MEALINC = meal;
          }
        }
        if (!params.ROOMS) {
          var room = $.getParameter("ROOMINC", 1, $module_container);
          if (room) {
            params.ROOMINC = room;
          }
        }
      }
      if (params.CHILD) {
        var $ages = [];
        $module_container.find(".child_ages .age").each(function () {
          if (this.value.length) {
            $ages.push(parseInt(this.value));
          }
        });
        params.AGES = $ages
          .sort(function (a, b) {
            return a - b;
          })
          .join(",");
      }
      let delimiter = "";
      const currentUrl = samo.parseURL($self.data("origHref"));
      if (Object.keys(currentUrl.params).length) {
        delimiter = "&";
      } else {
        delimiter = "?";
      }
      return samo.buildURL(
        $self.data("origHref") + delimiter + $.param(params)
      );
    }
    if (_controls.HOTELSSEL) {
      var $HOTELS = $(_controls.HOTELS);
      $HOTELS.find(":checked").each(function () {
        $HOTELS.triggerHandler(
          $.Event("click", {
            target: this,
          })
        );
      });
    }
    if (DOLOAD) {
      samo.initResultset();
      price_page_url();
      const filterHotels = $.getParameter("HOTELS", true);
      if (typeof filterHotels !== "undefined" && filterHotels !== "0") {
        $module_container
          .find(".HOTELS_SEL")
          .prop("checked", true)
          .triggerHandler("click");
      }
    }
    samo.blink_element();
    samo.setDefaultAges = function (ages) {
      var age1defaultValue = $module_container
        .find(".age_1")
        .find("option")
        .filter(function () {
          return this.defaultSelected;
        })
        .val();
      var age2defaultValue = $module_container
        .find(".age_2")
        .find("option")
        .filter(function () {
          return this.defaultSelected;
        })
        .val();
      var age3defaultValue = $module_container
        .find(".age_3")
        .find("option")
        .filter(function () {
          return this.defaultSelected;
        })
        .val();
      var age1 = $module_container.find(".age_1");
      var age2 = $module_container.find(".age_2");
      var age3 = $module_container.find(".age_3");
      if (age1.val() == age1defaultValue && age1.val() != ages[0]) {
        age1.val(ages[0]).trigger("chosen:updated");
      }
      if (age2.val() == age2defaultValue && age2.val() != ages[1]) {
        age2.val(ages[1]).trigger("chosen:updated");
      }
      if (age3.val() == age3defaultValue && age3.val() != ages[2]) {
        age3.val(ages[2]).trigger("chosen:updated");
      }
    };
    samo.gdsHotelParamsTill();
    $module_container.find(".WITHOUT_PROMO").on("click", function () {
      var $program_combo = $module_container.find(".PROGRAMINC");
      var $disabled = $(this).is(":checked");
      if (
        $disabled &&
        $program_combo.find('option:selected[data-promo="1"]').length
      ) {
        $program_combo
          .find('option[value="0"]')
          .prop("selected", true)
          .trigger("change");
      }
      $program_combo
        .find('option[data-promo="1"]')
        .prop("disabled", $disabled)
        .trigger("chosen:updated");
    });
  };
  samo.initHotelPopup(container);
  samo.note = function (note) {
    var $container = container.find(".note_container");
    if (note) {
      $container.ehtml(note).removeClass("blank-note");
    } else {
      $container.empty().addClass("blank-note");
    }
  };
  $(samo.search_tour);
})(samo.jQuery);
