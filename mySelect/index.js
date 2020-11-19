(function (window, document) {
    let Selector = function (option) {
        // 执行初始化方法
        this._init(option)
    }
    Selector.prototype = {
        _init({
            eleSelector = "", // 传入的选择器 id，class，tag等，用于将选择框渲染到此选择器所在的元素
            options = [{
                name: "请选择",
                value: "0"
            }], // 传入的下拉框对象，name为选择的文字，value为值
            defaultText = "请选择"  // 提供的默认选择的值
        }) {
            // 将传入的数据绑定到this上
            this.parentEle = document.querySelector(eleSelector) || document.body; // 要绑定的dom
            this.options = options; // 选择值数组对象
            this.defaultText = defaultText; // 默认值

            this.dropboxShow = false; // 定义存储下拉框的显示隐藏状态
            this.defaultValue = ""; // 定义默认选中的值
            this._createElement(); // 初始化后执行创建元素方法
        },
        _createElement() {
            // 选择框最外层的包裹元素
            let wrapEle = document.createElement("div");
            wrapEle.className = "my-select";

            // 根据传入的值获取选择框默认的值和内容
            this.options.forEach(item => {
                if (item.name === this.defaultText) {
                    this.defaultValue = item.value;
                }
            });

            // 选择框包裹元素
            let selectWarpBox = document.createElement("div")
            selectWarpBox.className = "select-selection";

            // 隐藏保存选择值的元素
            let inputHideBox = document.createElement("input");
            inputHideBox.type = "hidden";
            inputHideBox.value = this.defaultValue;

            // - 选择框默认展示框
            let selectShowBox = document.createElement("div")

            // -- 选择框展示的值的元素
            let selectNameBox = document.createElement("span")
            selectNameBox.className = "select-selected-value";
            selectNameBox.id = "select-option";
            // 将传入的默认值赋值
            selectNameBox.innerText = this.defaultText;
            // -- 角标元素
            let selectIcon = document.createElement("i")
            selectIcon.className = "arrow-down icon-select-arrow";

            // 将 span 和 角标元素 添加到外层div
            selectShowBox.appendChild(selectNameBox)
            selectShowBox.appendChild(selectIcon)

            // 最外层的将隐藏的input值框和展示框添加到最外层div
            selectWarpBox.appendChild(inputHideBox)
            selectWarpBox.appendChild(selectShowBox)

            // 下拉框
            let dropbox = document.createElement("div"), ulbox = document.createElement("ul");
            dropbox.className = "select-dropdown";
            // ulbox.className = "select-dropdown-list"
            // 遍历传入的选项值对象，生成下拉菜单的li元素并赋值
            this.options.forEach(item => {
                let itemLi = document.createElement("li")
                if (this.defaultText === item.name) {
                    itemLi.className = "select-item select-item-selected"
                } else {
                    itemLi.className = "select-item"
                }
                itemLi.setAttribute("data-value", item.value)
                itemLi.innerText = item.name;
                ulbox.appendChild(itemLi);
            })

            // 将下拉框url推入到包裹元素中
            dropbox.appendChild(ulbox);

            wrapEle.appendChild(selectWarpBox)
            wrapEle.appendChild(dropbox)

            this.parentEle.appendChild(wrapEle)

            // 把需要操作的dom挂载到当前实例
            this.eleSelect = selectWarpBox; // 选择框
            this.eleDrop = dropbox; // 下拉框
            this.eleSpan = selectNameBox; // 显示文字的span节点

            // 绑定事件处理函数
            this._bind(this.parentEle)
        },
        // 点击下拉框事件处理函数
        _selectHandleClick() {
            if (this.dropboxShow) {
                this._selectDropUp();
            } else {
                this._selectDropDown();
            }
        },
        // 收起下拉框选项
        _selectDropUp() {
            this.eleDrop.style.transform = "scale(1,0)"
            this.eleDrop.style.opacity = "0";
            this.eleSelect.className = "select-selection"
            this.dropboxShow = false;
        },
        // 展示下拉框选项
        _selectDropDown() {
            this.eleDrop.style.transform = "scale(1,1)"
            this.eleDrop.style.opacity = "1";
            this.eleSelect.className = "select-selection select-focus";
            this.dropboxShow = true;
        },
        // 点击下拉框选项进行赋值
        _dropItemClick(ele) {
            this.defaultValue = ele.getAttribute("data-value");
            this.eleSpan.innerText = ele.innerText;
            ele.className = "select-item select-item-selected";
            // 对点击选中的其他所有兄弟元素修改class去除选中样式
            this._siblingsDo(ele, function (ele) {
                if (ele) {
                    ele.className = "select-item";
                }
            });
            this._selectDropUp();
        },
        // node遍历是否是子元素包裹元素
        _getTargetNode(ele, target) {
            // ele是内部元素，target是想找到的包裹元素
            if (!ele || ele === document) return false;
            return ele === target ? true : this._getTargetNode(ele.parentNode, target)
        },
        // 兄弟元素遍历处理函数
        _siblingsDo(ele, fn) {
            (function (ele) {
                fn(ele);
                if (ele && ele.previousSibling) {
                    arguments.callee(ele.previousSibling)
                }
            })(ele.previousSibling);
            (function (ele) {
                fn(ele);
                if (ele && ele.nextSibling) {
                    arguments.callee(ele.nextSibling)
                }
            })(ele.nextSibling)
        },
        // 绑定下拉框事件处理函数
        _bind(parentEle) {
            let _this = this;
            // 时间委托到最外层包裹元素进行绑定处理
            parentEle.addEventListener("click", function (e) {
                const ele = e.target;
                // 遍历当前点击的元素，如果是选中框内的元素执行
                if (_this._getTargetNode(ele, _this.eleSelect)) {
                    if (_this.dropboxShow) {
                        _this._selectDropUp()
                    } else {
                        _this._selectDropDown()
                    }
                } else if (ele.className == "select-item") {
                    // 如果是点击的下拉框的选项执行
                    _this._dropItemClick(ele)
                } else {
                    // 点击其他地方隐藏下拉框
                    _this._selectDropUp()
                }
            })
        }
    };
    window.$Selector = Selector;
})(window, document)