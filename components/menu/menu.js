var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { NgModule, Component, ElementRef, Input, Output, EventEmitter, Renderer2, ViewChild, Inject, forwardRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { DomHandler } from '../dom/domhandler';
import { RouterModule } from '@angular/router';
var MenuItemContent = /** @class */ (function () {
    function MenuItemContent(menu) {
        this.menu = menu;
    }
    __decorate([
        Input("pMenuItemContent"),
        __metadata("design:type", Object)
    ], MenuItemContent.prototype, "item", void 0);
    MenuItemContent = __decorate([
        Component({
            selector: '[pMenuItemContent]',
            template: "\n        <a *ngIf=\"!item.routerLink\" [attr.href]=\"item.url||null\" class=\"ui-menuitem-link ui-corner-all\" [attr.data-automationid]=\"item.automationId\" [attr.target]=\"item.target\" [attr.title]=\"item.title\" [attr.id]=\"item.id\"\n            [ngClass]=\"{'ui-state-disabled':item.disabled}\" (click)=\"menu.itemClick($event, item)\">\n            <span class=\"ui-menuitem-icon\" *ngIf=\"item.icon\" [ngClass]=\"item.icon\"></span>\n            <span class=\"ui-menuitem-text\">{{item.label}}</span>\n        </a>\n        <a *ngIf=\"item.routerLink\" [routerLink]=\"item.routerLink\" [attr.data-automationid]=\"item.automationId\"  [queryParams]=\"item.queryParams\" [routerLinkActive]=\"'ui-state-active'\"\n            [routerLinkActiveOptions]=\"item.routerLinkActiveOptions||{exact:false}\" class=\"ui-menuitem-link ui-corner-all\" [attr.target]=\"item.target\" [attr.id]=\"item.id\"\n             [attr.title]=\"item.title\" [ngClass]=\"{'ui-state-disabled':item.disabled}\" (click)=\"menu.itemClick($event, item)\">\n            <span class=\"ui-menuitem-icon\" *ngIf=\"item.icon\" [ngClass]=\"item.icon\"></span>\n            <span class=\"ui-menuitem-text\">{{item.label}}</span>\n        </a>\n    "
        }),
        __param(0, Inject(forwardRef(function () { return Menu; }))),
        __metadata("design:paramtypes", [Object])
    ], MenuItemContent);
    return MenuItemContent;
}());
export { MenuItemContent };
var Menu = /** @class */ (function () {
    function Menu(el, renderer) {
        this.el = el;
        this.renderer = renderer;
        this.autoZIndex = true;
        this.baseZIndex = 0;
        this.showTransitionOptions = '225ms ease-out';
        this.hideTransitionOptions = '195ms ease-in';
        this.onShow = new EventEmitter();
        this.onHide = new EventEmitter();
    }
    Menu.prototype.toggle = function (event) {
        if (this.visible)
            this.hide();
        else
            this.show(event);
        this.preventDocumentDefault = true;
    };
    Menu.prototype.show = function (event) {
        this.target = event.currentTarget;
        this.visible = true;
        this.preventDocumentDefault = true;
    };
    Menu.prototype.onOverlayAnimationStart = function (event) {
        switch (event.toState) {
            case 'visible':
                if (this.popup) {
                    this.container = event.element;
                    this.moveOnTop();
                    this.onShow.emit({});
                    this.appendOverlay();
                    DomHandler.absolutePosition(this.container, this.target);
                    this.bindDocumentClickListener();
                    this.bindDocumentResizeListener();
                }
                break;
            case 'void':
                this.onOverlayHide();
                this.onHide.emit({});
                break;
        }
    };
    Menu.prototype.appendOverlay = function () {
        if (this.appendTo) {
            if (this.appendTo === 'body')
                document.body.appendChild(this.container);
            else
                DomHandler.appendChild(this.container, this.appendTo);
        }
    };
    Menu.prototype.restoreOverlayAppend = function () {
        if (this.container && this.appendTo) {
            this.el.nativeElement.appendChild(this.container);
        }
    };
    Menu.prototype.moveOnTop = function () {
        if (this.autoZIndex) {
            this.container.style.zIndex = String(this.baseZIndex + (++DomHandler.zindex));
        }
    };
    Menu.prototype.hide = function () {
        this.visible = false;
    };
    Menu.prototype.onWindowResize = function () {
        this.hide();
    };
    Menu.prototype.itemClick = function (event, item) {
        if (item.disabled) {
            event.preventDefault();
            return;
        }
        if (!item.url) {
            event.preventDefault();
        }
        if (item.command) {
            item.command({
                originalEvent: event,
                item: item
            });
        }
        if (this.popup) {
            this.hide();
        }
    };
    Menu.prototype.bindDocumentClickListener = function () {
        var _this = this;
        if (!this.documentClickListener) {
            this.documentClickListener = this.renderer.listen('document', 'click', function () {
                if (!_this.preventDocumentDefault) {
                    _this.hide();
                }
                _this.preventDocumentDefault = false;
            });
        }
    };
    Menu.prototype.unbindDocumentClickListener = function () {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    };
    Menu.prototype.bindDocumentResizeListener = function () {
        this.documentResizeListener = this.onWindowResize.bind(this);
        window.addEventListener('resize', this.documentResizeListener);
    };
    Menu.prototype.unbindDocumentResizeListener = function () {
        if (this.documentResizeListener) {
            window.removeEventListener('resize', this.documentResizeListener);
            this.documentResizeListener = null;
        }
    };
    Menu.prototype.onOverlayHide = function () {
        this.unbindDocumentClickListener();
        this.unbindDocumentResizeListener();
        this.preventDocumentDefault = false;
        this.target = null;
    };
    Menu.prototype.ngOnDestroy = function () {
        if (this.popup) {
            this.restoreOverlayAppend();
            this.onOverlayHide();
        }
    };
    Menu.prototype.hasSubMenu = function () {
        if (this.model) {
            for (var _i = 0, _a = this.model; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.items) {
                    return true;
                }
            }
        }
        return false;
    };
    __decorate([
        Input(),
        __metadata("design:type", Array)
    ], Menu.prototype, "model", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], Menu.prototype, "popup", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], Menu.prototype, "style", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], Menu.prototype, "styleClass", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], Menu.prototype, "appendTo", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], Menu.prototype, "autoZIndex", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], Menu.prototype, "baseZIndex", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], Menu.prototype, "showTransitionOptions", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], Menu.prototype, "hideTransitionOptions", void 0);
    __decorate([
        ViewChild('container', { static: false }),
        __metadata("design:type", ElementRef)
    ], Menu.prototype, "containerViewChild", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], Menu.prototype, "onShow", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], Menu.prototype, "onHide", void 0);
    Menu = __decorate([
        Component({
            selector: 'p-menu',
            template: "\n        <div #container [ngClass]=\"{'ui-menu ui-widget ui-widget-content ui-corner-all': true, 'ui-menu-dynamic ui-shadow': popup}\"\n            [class]=\"styleClass\" [ngStyle]=\"style\" (click)=\"preventDocumentDefault=true\" *ngIf=\"!popup || visible\"\n            [@overlayAnimation]=\"{value: 'visible', params: {showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions}}\" [@.disabled]=\"popup !== true\" (@overlayAnimation.start)=\"onOverlayAnimationStart($event)\">\n            <ul>\n                <ng-template ngFor let-submenu [ngForOf]=\"model\" *ngIf=\"hasSubMenu()\">\n                    <li class=\"ui-menu-separator ui-widget-content\" *ngIf=\"submenu.separator\" [ngClass]=\"{'ui-helper-hidden': submenu.visible === false}\"></li>\n                    <li class=\"ui-submenu-header ui-widget-header ui-corner-all\" [attr.data-automationid]=\"submenu.automationId\" *ngIf=\"!submenu.separator\" [ngClass]=\"{'ui-helper-hidden': submenu.visible === false}\">{{submenu.label}}</li>\n                    <ng-template ngFor let-item [ngForOf]=\"submenu.items\">\n                        <li class=\"ui-menu-separator ui-widget-content\" *ngIf=\"item.separator\" [ngClass]=\"{'ui-helper-hidden': (item.visible === false ||\u00A0submenu.visible === false)}\"></li>\n                        <li class=\"ui-menuitem ui-widget ui-corner-all\" *ngIf=\"!item.separator\" [pMenuItemContent]=\"item\" [ngClass]=\"{'ui-helper-hidden': (item.visible === false || submenu.visible === false)}\" [ngStyle]=\"item.style\" [class]=\"item.styleClass\"></li>\n                    </ng-template>\n                </ng-template>\n                <ng-template ngFor let-item [ngForOf]=\"model\" *ngIf=\"!hasSubMenu()\">\n                    <li class=\"ui-menu-separator ui-widget-content\" *ngIf=\"item.separator\" [ngClass]=\"{'ui-helper-hidden': item.visible === false}\"></li>\n                    <li class=\"ui-menuitem ui-widget ui-corner-all\" *ngIf=\"!item.separator\" [pMenuItemContent]=\"item\" [ngClass]=\"{'ui-helper-hidden': item.visible === false}\" [ngStyle]=\"item.style\" [class]=\"item.styleClass\"></li>\n                </ng-template>\n            </ul>\n        </div>\n    ",
            animations: [
                trigger('overlayAnimation', [
                    state('void', style({
                        transform: 'translateY(5%)',
                        opacity: 0
                    })),
                    state('visible', style({
                        transform: 'translateY(0)',
                        opacity: 1
                    })),
                    transition('void => visible', animate('{{showTransitionParams}}')),
                    transition('visible => void', animate('{{hideTransitionParams}}'))
                ])
            ]
        }),
        __metadata("design:paramtypes", [ElementRef, Renderer2])
    ], Menu);
    return Menu;
}());
export { Menu };
var MenuModule = /** @class */ (function () {
    function MenuModule() {
    }
    MenuModule = __decorate([
        NgModule({
            imports: [CommonModule, RouterModule],
            exports: [Menu, RouterModule],
            declarations: [Menu, MenuItemContent]
        })
    ], MenuModule);
    return MenuModule;
}());
export { MenuModule };
//# sourceMappingURL=menu.js.map