/*
 * Drakkar-Software OctoBot
 * Copyright (c) Drakkar-Software, All rights reserved.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3.0 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library.
 */

function createPortfolioChart(element_id, title, animate){
    const data = {};
    $(".symbol-holding").each(function (){
        const total_value = $(this).find(".total-value").text();
        if($.isNumeric(total_value)){
            data[$(this).find(".symbol").text()] = Number(total_value);
        }
    });
    const element = $("#"+element_id);
    if(Object.keys(data).length > 0 && element.length > 0){
        create_doughnut_chart(element[0], data, title, 'white', animate);
    }
}

function handle_portfolio_button(){
    const refreshButton = $("#refresh-portfolio");
    if(refreshButton){
        refreshButton.click(function () {
            const update_url = refreshButton.attr(update_url_attr);
            send_and_interpret_bot_update({}, update_url, null, generic_request_success_callback, generic_request_failure_callback);
        });
    }
}

function start_periodic_refresh(){
    setInterval(function() {
        $("#portfolio-display").load(location.href + " #portfolio-display", function (){
            update_display(true, false);
        });
    }, portfolio_update_interval);
}

function handle_rounded_numbers_display(){
    $(".rounded-number").each(function (){
        const text = $(this).text().trim();
        if (!isNaN(text)){
            const value = Number(text);
            const decimal = value > 1 ? 3 : 8;
            $(this).text(handle_numbers(round_digits(text, decimal)));
        }
    });
}

function update_display(withImages, animate){
    const portfolioElem = $("#portfoliosCard");
    const referenceMarket = portfolioElem.attr("reference_market");
    const chartTitle = "Traded assets value in "+referenceMarket;
    handle_rounded_numbers_display();
    ordersDataTable = $('#holdings-table').DataTable({
        "paging": false,
        "bDestroy": true,
        "order": [[ 2, "desc" ]],
        "searching": $("tr.symbol-holding").length > 10,
    });
    createPortfolioChart("portfolio_doughnutChart", chartTitle, animate);
    if(withImages){
        handleDefaultImages();
    }
}

let firstLoad = true;

$(document).ready(function() {
    update_display(false, true);
    if(firstLoad){
        start_periodic_refresh();
        handle_portfolio_button();
    }
});
