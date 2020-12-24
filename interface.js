// The generic dom container element class
class DOMContainer {
  constructor(
    objectHint,
    appendAnimation = "append",
    removeAnimation = "remove"
  ) {
    if (typeof objectHint.tagName === "undefined") {
      // Then the hint is a query string
      this.element = document.querySelector(objectHint);
    } else {
      // else it is an actual element
      this.element = objectHint;
    }
    // registering the appending and removing animations
    this.appendAnimation = appendAnimation;
    this.removeAnimation = removeAnimation;
  }

  appendChildWithStyle(elementItem) {
    // this function appends an element with the specified animations
    elementItem.classList.add(this.appendAnimation);
    // appending the child
    this.element.appendChild(elementItem);
    elementItem.classList.add("running");
    // this function will remove classes and also deregister itself
    const cleanAppendAnimation = (e) => {
      // removes the append animation and running state
      elementItem.classList.remove(this.appendAnimation);
      elementItem.classList.remove("running");
      // clears this event listener
      elementItem.removeEventListener("animationend", cleanAppendAnimation);
    };
    elementItem.addEventListener("animationend", cleanAppendAnimation);
  }

  getNthChild(n) {
    return this.element.children[n - 1];
  }

  removeChildWithStyle(elementItem) {
    elementItem.classList.add(this.removeAnimation);
    elementItem.classList.add("running");
    const cleanRemoveAnimation = (e) => {
      elementItem.classList.remove(this.removeAnimation);
      elementItem.classList.remove("running");
      elementItem.remove();
      elementItem.removeEventListener("animationend", cleanRemoveAnimation);
    };
    elementItem.addEventListener("animationend", cleanRemoveAnimation);
  }

  changeInnerHtmlWithStyle(newHTML) {
    // Capturing the element due to some referrence issues
    const element = this.element;
    // Now making it disappear
    element.style.opacity = "0";
    // When the transition end, this function will be called
    function changeHTML() {
      // This function is a timeout callback
      element.innerHTML = newHTML;
      element.style.opacity = "1";
    }
    setTimeout(changeHTML, this.transitionDuration);
  }
}

// This class is for the messaging container, used to give messages in the interface
class MessageContainer extends DOMContainer {
  constructor(
    objectHint,
    appendAnimation = "append-yourself",
    removeAnimation = "remove-Yourself",
    animationDuration = 500,
    transitionDuration = 200
  ) {
    super(
      objectHint,
      appendAnimation,
      removeAnimation,
      animationDuration,
      transitionDuration
    );
  }

  createAppendChild(message, typeClass) {
    // appends the message with the applied classes
    const child = document.createElement("div");
    child.className = typeClass;
    child.innerHTML = message;
    this.appendChildWithStyle(child);
    return child;
  }

  flash(message, typeClass, timeout = 0) {
    // creating the children
    const child = this.createAppendChild(message, typeClass);

    if (timeout > 0) {
      const enclosingThis = this;
      setTimeout(function () {
        enclosingThis.removeChildWithStyle(child);
      }, timeout);
    }
  }
}

class FrontCardContain extends DOMContainer {
  constructor(
    objectHint = "#fcard-contain",
    appendAnimation = "come-down",
    removeAnimation = "come-up"
  ) {
    super(objectHint, appendAnimation, removeAnimation);
    this.children = {};
    this.opened = null;

    // this loop removes all children and saves them for showing
    const children = this.element.children;
    for (let i = 0, l = children.length; i < l; i++) {
      // removing the card from  container
      let child = children[i];
      this.children[child.getAttribute("id")] = child;
      child.remove();

      // adding the close event listeners
      this.element.addEventListener("click", (e) => {
        const target = e.target;
        if (target.classList.contains("close")) {
          this.close();
        }
      });
    }
  }

  // for showing the front card
  open(fcard_id) {
    if (this.opened === null) {
      this.element.classList.add("opened");
      const card = this.children[fcard_id];
      this.appendChildWithStyle(card);
      this.opened = card;
    } else {
      throw new Error("A Front Card is already Opened");
    }
  }

  close() {
    if (this.opened !== null) {
      const card = this.opened;
      this.removeChildWithStyle(card);
      this.opened = null;
      // we have to asynchronously hide the container
      this.element.classList.remove("opened");
    } else {
      throw new Error("There is no Frond Card Opened!");
    }
  }
}
