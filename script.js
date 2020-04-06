import BUTTON from './data.js'

class VirtualKeyboard {
    constructor() {      
        this.BUTTONS_WHICH = BUTTON.BUTTONS_WHICH
        this.BUTTONS_CODE = BUTTON.BUTTONS_CODE
        this.BUTTONS_VALUE_RUS = BUTTON.BUTTONS_VALUE_RUS
        this.BUTTONS_VALUE_ENG = BUTTON.BUTTONS_VALUE_ENG
        this.BUTTONS_VALUE_RUS_CAPSLOCK = BUTTON.BUTTONS_VALUE_RUS_CAPSLOCK
        this.BUTTONS_VALUE_ENG_CAPSLOCK = BUTTON.BUTTONS_VALUE_ENG_CAPSLOCK

        this.isCapsLock = false
        this.isShift = false
        this.isEng = JSON.parse(localStorage.getItem('isEng'))
    }

    createElements() {
        const body = document.querySelector('body')

        this.WRAPPER = document.createElement('div')
        this.WRAPPER.classList.add('wrapper')
        body.appendChild(this.WRAPPER)
    
        this.TEXTFIELD = document.createElement('textarea')
        this.TEXTFIELD.classList.add('input-area')
        this.WRAPPER.appendChild(this.TEXTFIELD) 

        this.KEYBOARD = document.createElement('ul')
        this.KEYBOARD.classList.add('keyboard')
        this.WRAPPER.appendChild(this.KEYBOARD)

        this.CHANGE_LANGUAGE = document.createElement('p')
        this.CHANGE_LANGUAGE.classList.add('text')
        this.CHANGE_LANGUAGE.innerText = 'WARNING! Press CTRL + ALT to change language'
        this.WRAPPER.appendChild(this.CHANGE_LANGUAGE)
    }

    toggleValue (buttonValue, index, isEng, isCapsLock, isShift) {

        if (isEng) buttonValue = this.BUTTONS_VALUE_ENG[index]

        if (isEng && isCapsLock) buttonValue = this.BUTTONS_VALUE_ENG_CAPSLOCK[index]

        if (isEng && isShift && isCapsLock) buttonValue = this.BUTTONS_VALUE_ENG[index]
        else if (isEng && isShift) buttonValue = this.BUTTONS_VALUE_ENG_CAPSLOCK[index]

        if (!isEng) buttonValue = this.BUTTONS_VALUE_RUS[index]

        if (!isEng && isCapsLock) buttonValue = this.BUTTONS_VALUE_RUS_CAPSLOCK[index]

        if (!isEng && isShift && isCapsLock) buttonValue = this.BUTTONS_VALUE_RUS[index]
        else if (!isEng && isShift) buttonValue = this.BUTTONS_VALUE_RUS_CAPSLOCK[index]

        return buttonValue
    }

    addButtons() {
        this.KEYBOARD.querySelectorAll('li').forEach(el => el.remove())

        this.BUTTONS_WHICH.forEach((item, index) => {
            let buttonValue = ''
            buttonValue = this.toggleValue(buttonValue, index, this.isEng, this.isCapsLock, this.isShift)

            let property = 'keyboard__item '

            if (item == 8) {
                property += 'backspace'
            }

            if (item == 9) {
                property += 'tab'
            }

            if (item == 46) {
                buttonValue = 'Del'
            }

            if (item == 20) {
                property += 'capslock'
            }

            if (item == 13) {
                property += 'enter'
            }

            if (item == 16) {
                property += 'shift'
            }

            if (item == 17) {
                buttonValue = 'Ctrl'
                property += 'ctrl'
            }

            if (item == 32) {
                property += 'space'
            }

            this.KEYBOARD.innerHTML += `<li class='${property}' data-code=${this.BUTTONS_CODE[index]}>${buttonValue}</li>`
        })


        let shiftLeft = document.querySelector('li[data-code="ShiftLeft"]')
        let shifRight = document.querySelector('li[data-code="ShiftRight"]')

        if (this.isShift == true) {
            if (event.code === 'ShiftLeft') shiftLeft.classList.add('changecase')
            else if (event.code === 'ShiftRight') shifRight.classList.add('changecase')
        }

        this.CAPSLOCK = document.querySelector('li[data-code="CapsLock"]')
    }

    buttonDown(event) {
        event.preventDefault();
        if (!document.querySelector('li[data-code="' + event.code + '"]'))
            return;
        else document.querySelector('li[data-code="' + event.code + '"]').classList.add('keyboard__item--active')

        let text = ''
        let index = this.BUTTONS_WHICH.indexOf(event.which)
        text = this.toggleValue(text, index, this.isEng, this.isCapsLock, this.isShift)

        if (event.key !== 'Control' && 
            event.key !== 'Alt' && 
            event.key !== 'Shift' && 
            event.key !== 'CapsLock' && 
            event.key !== 'Backspace' &&
            event.key !== 'Delete' && 
            event.key !== 'Enter' &&
            event.code !== 'MetaLeft' && 
            event.code !== 'Tab' &&  
            event.code !== 'Space') {
            this.TEXTFIELD.innerHTML += text
        } else {
            if (event.key === 'Backspace') this.TEXTFIELD.innerHTML = this.TEXTFIELD.innerHTML.slice(0, -1)
            if (event.key === 'Tab') this.TEXTFIELD.innerHTML += '   '
            if (event.key === 'Delete') this.TEXTFIELD.innerHTML = this.TEXTFIELD.innerHTML.slice(0, -1)
            if (event.key === 'Enter') this.TEXTFIELD.innerHTML += '\n'
            if (event.code === 'Space') this.TEXTFIELD.innerHTML += ' '

            if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
                this.isShift = true
                this.addButtons()
            }
        }
    }

    buttonUp(event) {
        event.preventDefault();
        document.querySelectorAll('li').forEach(button => button.classList.remove('keyboard__item--active'))

        if ((event.code === 'ControlLeft' && event.altKey) || (event.code === 'AltLeft' && event.ctrlKey)) {
            this.isEng = !this.isEng
            localStorage.setItem('isEng', this.isEng)
            this.addButtons()
            this.KEYBOARD.classList.toggle('eng')
        }

        if (event.which === 20) {
            this.isCapsLock = !this.isCapsLock;
            this.addButtons()

            if (this.isCapsLock) this.CAPSLOCK.classList.toggle('changecase')
        }

        if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
            this.isShift = false
            this.addButtons()
        }
    }

    buttonListener() {
        document.addEventListener('keydown', event => this.buttonDown(event))
        document.addEventListener('keyup', event => this.buttonUp(event))

        this.KEYBOARD.addEventListener('mousedown', event => {
            if (event.target.tagName == 'UL') return

            else {
                let button = event.target
                button.classList.add('active')
                let buttonDataCode = button.getAttribute('data-code')

                if (buttonDataCode !== 'Backspace' && 
                    buttonDataCode !== 'Tab' &&
                    buttonDataCode !== 'Delete' && 
                    buttonDataCode !== 'CapsLock' && 
                    buttonDataCode !== 'Enter' &&
                    buttonDataCode !== 'ShiftLeft' && 
                    buttonDataCode !== 'ShiftRight' &&                      
                    buttonDataCode !== 'ControlLeft' && 
                    buttonDataCode !== 'MetaLeft' && 
                    buttonDataCode !== 'AltLeft' && 
                    buttonDataCode !== 'Space' &&
                    buttonDataCode !== 'AltRight' &&            
                    buttonDataCode !== 'ControlRight') {
                    this.TEXTFIELD.innerHTML += button.innerText
                } else {
                    if (buttonDataCode === 'Backspace') this.TEXTFIELD.innerHTML = this.TEXTFIELD.innerHTML.slice(0, -1)
                    if (buttonDataCode === 'Tab') this.TEXTFIELD.innerHTML += '   '
                    if (buttonDataCode === 'Delete') this.TEXTFIELD.innerHTML = this.TEXTFIELD.innerHTML.slice(0, -1)
                    if (buttonDataCode === 'Enter') this.TEXTFIELD.innerHTML += '\n'
                    if (buttonDataCode === 'Space') this.TEXTFIELD.innerHTML += ' '
                    
                    if (buttonDataCode == 'ShiftLeft' || buttonDataCode == 'ShiftRight') {
                        this.isShift = !this.isShift
                        this.addButtons()

                        let shiftLeft = document.querySelector('li[data-code="ShiftLeft"]')
                        let shifRight = document.querySelector('li[data-code="ShiftRight"]')

                        if (this.isShift == true) {
                            if (buttonDataCode === 'ShiftLeft') shiftLeft.classList.add('changecase')
                            else if (buttonDataCode === 'ShiftRight') shifRight.classList.add('changecase')
                        }
                    }

                    if (buttonDataCode == 'CapsLock') {
                        this.isCapsLock = !this.isCapsLock;
                        this.addButtons();
                    }
                }
            }
        })

        this.KEYBOARD.addEventListener('mouseup', () => {
            this.isShift = false
            this.addButtons()
            
            if (this.isCapsLock) {
                this.CAPSLOCK.classList.add('changecase')
            } else this.CAPSLOCK.classList.remove('changecase')
        })
    }
}

window.addEventListener('load', () => {
    const keyboard = new VirtualKeyboard()

    keyboard.createElements()
    keyboard.buttonListener()
    keyboard.addButtons()
})





