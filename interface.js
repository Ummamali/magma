// The generic dom container element class
class DOMContainer{
    constructor(objectHint,
        appendAnimation = 'append-yourself',
        removeAnimation = 'remove-Yourself',
        animationDuration = 500,
        transitionDuration = 300){
        if (typeof objectHint.tagName === 'undefined'){
            // Then the hint is a query string
            this.element = document.querySelector(objectHint);
        }else{
            // else it is an actual element
            this.element = objectHint;
        }
        this.element.style.transitionProperty = 'opacity';
        this.transitionDuration = transitionDuration;
        this.element.style.transitionDuration = `${this.transitionDuration}ms`;
        // registering the appending and removing animations
        this.appendAnimation = appendAnimation;
        this.removeAnimation = removeAnimation;
        this.animationDuration = animationDuration;
    }

    setup(elementItem){
        // This function sets up an element to be added for the animations
        elementItem.style.animationName = this.appendAnimation;
        elementItem.style.animationDuration = `${this.animationDuration}ms`;
        elementItem.style.animationFillMode = 'forwards';
        elementItem.style.animationPlayState = 'paused';
    }

    appendChildWithStyle(elementItem){
        // this function appends an element with the specified animations
        this.setup(elementItem);
        // capturing the domContainer due to some referrence issues in event handler
        const container = this;
        container.element.appendChild(elementItem);
        elementItem.style.animationPlayState = 'running';
        elementItem.addEventListener('animationend', function(e){
            // sets the animation to whatever the removing is supplied in the domContainer
            this.style.animationName = container.removeAnimation;
            this.style.animationPlayState = 'paused';
        });
    };

    getNthChild(n){
        return this.element.children[n-1];
    };

    removeChildWithStyle(elementItem){
        elementItem.style.animationPlayState = 'running';
        elementItem.addEventListener('animationend', function(e){
            this.remove();
        });
    };

    changeInnerHtmlWithStyle(newHTML){
        // Capturing the element due to some referrence issues
        const element = this.element;
        // Now making it disappear
        element.style.opacity = '0';
        // When the transition end, this function will be called
        function changeHTML(){
            // This function is a timeout callback
            element.innerHTML = newHTML;
            element.style.opacity = '1';
        }
        setTimeout(changeHTML, this.transitionDuration);
    }
}



// This class is for the messaging container, used to give messages in the interface
class MessageContainer extends DOMContainer {
    constructor(objectHint,
        appendAnimation = 'append-yourself',
        removeAnimation = 'remove-Yourself',
        animationDuration = 500,
        transitionDuration = 200){
            super(objectHint,
                appendAnimation,
                removeAnimation,
                animationDuration,
                transitionDuration);
    }

    createAppendChild(message, typeClass) {
    // appends the message with the applied classes
      const child = document.createElement("div");
      child.className = typeClass;
      child.innerHTML = message;
      this.appendChildWithStyle(child);
      return child;
    }

    flash(message, typeClass, timeout=0){
        // creating the children
        const child = this.createAppendChild(message, typeClass);

        if(timeout > 0){
            const enclosingThis = this;
            setTimeout(function(){
                enclosingThis.removeChildWithStyle(child);
            }, timeout);
        }
        
    }
  }
  