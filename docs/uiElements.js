let slider;
let slider_max_value;

function buildSliderFilter(max_value) {
    slider = document.getElementById('slider');
    slider_max_value = max_value

    // exponent to apply for non linear slider scaling (set to 1 for linear scaling)
    let exponent=5

    noUiSlider.create(slider, {
        start: 0,  // start with full range
        connect: "upper",  // coloured bars between handles
         // step: 10000, // this one adds labeled ticks below, but unfortunately also adds snapping
        range: {
            'min': 0,
            '25%' : max_value*Math.pow(0.25, exponent),
            '50%' : max_value*Math.pow(0.5, exponent),
            '75%' : max_value*Math.pow(0.75, exponent),
            'max': max_value
        },
        pips: {
            mode: 'steps',
            stepped: true,
            density: 4
        }
    });

    // Remove start value
    document.querySelector('.noUi-value').remove();

    // Associate handlers to changed ranges. Gets called no matter which end was touched.
    slider.noUiSlider.on('update', handleSliderChange)

    // Build initial
    focusNodeById(root_node)

}

function getFilterValue() {
        let slider_value = slider.noUiSlider.get()
        return Math.round(slider_value)
}

function resetSlider() {
    slider.noUiSlider.set([0, slider_max_value])
    buildGrid()
}

/**
 * Called whenever the slider range is changed.
 */
function handleSliderChange() {

    let ext_min = getFilterValue()
    console.log("Registered slider change: Min="+ext_min)
    document.getElementById('min-ext-value').innerText=ext_min
    buildGrid()
}

function registerElementListeners() {
    document.getElementById('children-tab').addEventListener("click", () => toggleTabs("children"));
    document.getElementById('parents-tab').addEventListener("click", () => toggleTabs("parents"));
    document.getElementById('focus-root').addEventListener("click", () => focusNodeById(root_node));
    document.getElementById('reset-range').addEventListener("click", () => resetSlider());
    document.getElementById('switchExtensions').addEventListener("click", () => refreshSettingsState('switchExtensions', 'extension-line', 'hidden-line'));
    document.getElementById('switchIdentifiers').addEventListener("click", () => refreshSettingsState('switchIdentifiers', 'id-line', 'hidden-line'));
    document.getElementById('switchHeightLimit').addEventListener("click", () => refreshSettingsState('switchHeightLimit', 'node-cell', 'limit-height'));
}

function toggleTabs(target) {
    console.log("switching to: " + target)
    if (target === "children") {
        child_mode = true
        document.getElementById('children-tab').classList.add("active")
        document.getElementById('parents-tab').classList.remove("active")
        buildGrid()
    } else {
        child_mode = false
        document.getElementById('children-tab').classList.remove("active")
        document.getElementById('parents-tab').classList.add("active")
        buildGrid()
    }
}

function refreshSettingsState(checkbox_name, class_search_name, toggle_class) {
    let all_identifier_lines = document.getElementsByClassName(class_search_name)
    for (let i = 0; i < all_identifier_lines.length; i++) {
        if (isCheckedStatus(checkbox_name))
            all_identifier_lines[i].classList.remove(toggle_class)
        else
            all_identifier_lines[i].classList.add(toggle_class)

    }
}

function isCheckedStatus(checkbox_name) {
    let checkbox = document.getElementById(checkbox_name)
    let status = checkbox.checked == true
    return status
}