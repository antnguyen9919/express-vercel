const submit_btn = document.querySelector("#submit_button");

const name_input = document.querySelector("#name");
const original_name = name_input.value;

const email_input = document.querySelector("#email");
const original_email = email_input.value;

const opw_input = document.getElementById("old-password");

const npw_input = document.getElementById("new-password");

const cpw_input = document.getElementById("confirm-password");

let value_array = [
  {
    element: name_input,
    element_name: "name",
    og_value: original_name,
  },
];
const opw_ref = {
  element: opw_input,
  element_name: "password",
  og_value: "",
};
const npw_ref = {
  element: npw_input,
  element_name: "new_password",
  og_value: "",
};
const cpw_ref = {
  element: cpw_input,
  element_name: "confirm_password",
  og_value: "",
};

value_array.forEach((el) => {
  el.element.addEventListener("keyup", () => {
    if (el.element.value !== el.og_value) {
      submit_btn.removeAttribute("disabled");
      if (!el.element.getAttribute("name")) {
        console.log(el.element);
        el.element.setAttribute("name", el.element_name);
      }
    } else {
      submit_btn.setAttribute("disabled", true);
      el.element.removeAttribute("name");
    }
  });
});

opw_input.addEventListener("keyup", function () {
  if (
    opw_input.value &&
    npw_input.value &&
    cpw_input.value &&
    npw_input.value === cpw_input.value &&
    npw_input.value !== opw_input.value
  ) {
    opw_input.setAttribute("name", "old_password");
    npw_input.setAttribute("name", "new_password");
    submit_btn.removeAttribute("disabled");
  } else {
    submit_btn.setAttribute("disabled", true);
  }
});
npw_input.addEventListener("keyup", function () {
  if (
    opw_input.value &&
    npw_input.value &&
    cpw_input.value &&
    npw_input.value === cpw_input.value &&
    npw_input.value !== opw_input.value
  ) {
    opw_input.setAttribute("name", "old_password");
    npw_input.setAttribute("name", "new_password");
    submit_btn.removeAttribute("disabled");

    console.log(npw_input);
  } else {
    submit_btn.setAttribute("disabled", true);
  }
});
cpw_input.addEventListener("keyup", function () {
  if (
    opw_input.value &&
    npw_input.value &&
    cpw_input.value &&
    npw_input.value === cpw_input.value &&
    npw_input.value !== opw_input.value
  ) {
    opw_input.setAttribute("name", "old_password");
    npw_input.setAttribute("name", "new_password");
    submit_btn.removeAttribute("disabled");
  } else {
    submit_btn.setAttribute("disabled", true);
  }
});

// toggle_edit_btn.addEventListener();
