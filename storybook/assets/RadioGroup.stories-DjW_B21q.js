import{r as m,R as j,aw as U,au as K,j as r,p as ie}from"./iframe-BZbCHoUM.js";import{$ as J,c as se,d as oe,b as Q,a as X,f as de,e as le}from"./utils-CfGZ4Clr.js";import{$ as te}from"./FieldError-Z5lKC_c2.js";import{c as ne,b as ue,a as ce}from"./Form-C0o4Wn_y.js";import{$ as pe}from"./Label-CwnVjHYj.js";import{$ as be,c as fe,a as me}from"./SelectionIndicator-BBNLkP1K.js";import{a as ve}from"./Text-CsQJ0nka.js";import{b as C,d as Re,$ as $e,a as he}from"./useObjectRef-FeXUk1rj.js";import{$ as xe,a as T,u as ge,e as ye}from"./useFocusable-DMHJR1Ta.js";import{$ as qe}from"./useControlledState-_Te7eGF7.js";import{$ as Pe,b as De,a as Se}from"./useFocusRing-CMSP-eLx.js";import{$ as je}from"./useField-1di9YIwZ.js";import{$ as Ce}from"./context-Binh1Hb9.js";import{$ as Ve}from"./useFormReset-B9RadbxB.js";import{$ as H}from"./usePress-CX5VBNce.js";import{a as Ge}from"./VisuallyHidden-B7i-zuNG.js";import{F as Be}from"./FieldLabel-CLWBdV4O.js";import{F as Ie}from"./FieldError-STEeTtMw.js";import"./preload-helper-PPVm8Dsz.js";import"./Hidden-DEC4QRIi.js";import"./openLink-DkamvTea.js";import"./useLabel-BQGxIH3x.js";import"./useLabels-6Oae5x4h.js";import"./textSelection-D1bI-xuP.js";const Y=new WeakMap;function we(e,a,d){let{value:s,children:p,"aria-label":l,"aria-labelledby":v,onPressStart:o,onPressEnd:c,onPressChange:u,onPress:t,onPressUp:n,onClick:b}=e;const R=e.isDisabled||a.isDisabled;let D=a.selectedValue===s,q=G=>{G.stopPropagation(),a.setSelectedValue(s)},{pressProps:S,isPressed:B}=H({onPressStart:o,onPressEnd:c,onPressChange:u,onPress:t,onPressUp:n,onClick:b,isDisabled:R}),{pressProps:I,isPressed:V}=H({onPressStart:o,onPressEnd:c,onPressChange:u,onPressUp:n,onClick:b,isDisabled:R,onPress(G){var W;t?.(G),a.setSelectedValue(s),(W=d.current)===null||W===void 0||W.focus()}}),{focusableProps:A}=xe(C(e,{onFocus:()=>a.setLastFocusedValue(s)}),d),y=C(S,A),f=T(e,{labelable:!0}),x=-1;a.selectedValue!=null?a.selectedValue===s&&(x=0):(a.lastFocusedValue===s||a.lastFocusedValue==null)&&(x=0),R&&(x=void 0);let{name:g,form:w,descriptionId:ae,errorMessageId:re,validationBehavior:z}=Y.get(a);return Ve(d,a.defaultSelectedValue,a.setSelectedValue),ne({validationBehavior:z},a,d),{labelProps:C(I,m.useMemo(()=>({onClick:G=>G.preventDefault(),onMouseDown:G=>G.preventDefault()}),[])),inputProps:C(f,{...y,type:"radio",name:g,form:w,tabIndex:x,disabled:R,required:a.isRequired&&z==="native",checked:D,value:s,onChange:q,"aria-describedby":[e["aria-describedby"],a.isInvalid?re:null,ae].filter(Boolean).join(" ")||void 0}),isDisabled:R,isSelected:D,isPressed:B||V}}function _e(e,a){let{name:d,form:s,isReadOnly:p,isRequired:l,isDisabled:v,orientation:o="vertical",validationBehavior:c="aria"}=e,{direction:u}=Ce(),{isInvalid:t,validationErrors:n,validationDetails:b}=a.displayValidation,{labelProps:R,fieldProps:D,descriptionProps:q,errorMessageProps:S}=je({...e,labelElementType:"span",isInvalid:a.isInvalid,errorMessage:e.errorMessage||n}),B=T(e,{labelable:!0}),{focusWithinProps:I}=Pe({onBlurWithin(y){var f;(f=e.onBlur)===null||f===void 0||f.call(e,y),a.selectedValue||a.setLastFocusedValue(null)},onFocusWithin:e.onFocus,onFocusWithinChange:e.onFocusChange}),V=y=>{let f;switch(y.key){case"ArrowRight":u==="rtl"&&o!=="vertical"?f="prev":f="next";break;case"ArrowLeft":u==="rtl"&&o!=="vertical"?f="next":f="prev";break;case"ArrowDown":f="next";break;case"ArrowUp":f="prev";break;default:return}y.preventDefault();let x=be(y.currentTarget,{from:ye(y),accept:w=>w instanceof ge(w).HTMLInputElement&&w.type==="radio"}),g;f==="next"?(g=x.nextNode(),g||(x.currentNode=y.currentTarget,g=x.firstChild())):(g=x.previousNode(),g||(x.currentNode=y.currentTarget,g=x.lastChild())),g&&(g.focus(),a.setSelectedValue(g.value))},A=Re(d);return Y.set(a,{name:A,form:s,descriptionId:q.id,errorMessageId:S.id,validationBehavior:c}),{radioGroupProps:C(B,{role:"radiogroup",onKeyDown:V,"aria-invalid":a.isInvalid||void 0,"aria-errormessage":e["aria-errormessage"],"aria-readonly":p||void 0,"aria-required":l||void 0,"aria-disabled":v||void 0,"aria-orientation":o,...D,...I}),labelProps:R,descriptionProps:q,errorMessageProps:S,isInvalid:t,validationErrors:n,validationDetails:b}}let Fe=Math.round(Math.random()*1e10),Le=0;function Ne(e){let a=m.useMemo(()=>e.name||`radio-group-${Fe}-${++Le}`,[e.name]);var d;let[s,p]=qe(e.value,(d=e.defaultValue)!==null&&d!==void 0?d:null,e.onChange),[l]=m.useState(s),[v,o]=m.useState(null),c=ue({...e,value:s}),u=b=>{!e.isReadOnly&&!e.isDisabled&&(p(b),c.commitValidation())},t=c.displayValidation.isInvalid;var n;return{...c,name:a,selectedValue:s,defaultSelectedValue:e.value!==void 0?l:(n=e.defaultValue)!==null&&n!==void 0?n:null,setSelectedValue:u,lastFocusedValue:v,setLastFocusedValue:o,isDisabled:e.isDisabled||!1,isReadOnly:e.isReadOnly||!1,isRequired:e.isRequired||!1,validationState:e.validationState||(t?"invalid":null),isInvalid:t}}const Oe=m.createContext(null),Ee=m.createContext(null),Z=m.createContext(null),Me=m.forwardRef(function(a,d){[a,d]=J(a,d,Oe);let{validationBehavior:s}=se(ce)||{};var p,l;let v=(l=(p=a.validationBehavior)!==null&&p!==void 0?p:s)!==null&&l!==void 0?l:"native",o=Ne({...a,validationBehavior:v}),[c,u]=oe(!a["aria-label"]&&!a["aria-labelledby"]),{radioGroupProps:t,labelProps:n,descriptionProps:b,errorMessageProps:R,...D}=_e({...a,label:u,validationBehavior:v},o),q=Q({...a,values:{orientation:a.orientation||"vertical",isDisabled:o.isDisabled,isReadOnly:o.isReadOnly,isRequired:o.isRequired,isInvalid:o.isInvalid,state:o},defaultClassName:"react-aria-RadioGroup"}),S=T(a,{global:!0});return j.createElement(X.div,{...C(S,q,t),ref:d,slot:a.slot||void 0,"data-orientation":a.orientation||"vertical","data-invalid":o.isInvalid||void 0,"data-disabled":o.isDisabled||void 0,"data-readonly":o.isReadOnly||void 0,"data-required":o.isRequired||void 0},j.createElement(de,{values:[[Z,o],[pe,{...n,ref:c,elementType:"span"}],[ve,{slots:{description:b,errorMessage:R}}],[te,D]]},j.createElement(fe,null,q.children)))}),ke=m.forwardRef(function(a,d){let{inputRef:s=null,...p}=a;[a,d]=J(p,d,Ee);let l=j.useContext(Z),v=$e(m.useMemo(()=>he(s,a.inputRef!==void 0?a.inputRef:null),[s,a.inputRef])),{labelProps:o,inputProps:c,isSelected:u,isDisabled:t,isPressed:n}=we({...le(a),children:typeof a.children=="function"?!0:a.children},l,v),{isFocused:b,isFocusVisible:R,focusProps:D}=De(),q=t||l.isReadOnly,{hoverProps:S,isHovered:B}=Se({...a,isDisabled:q}),I=Q({...a,defaultClassName:"react-aria-Radio",values:{isSelected:u,isPressed:n,isHovered:B,isFocused:b,isFocusVisible:R,isDisabled:t,isReadOnly:l.isReadOnly,isInvalid:l.isInvalid,isRequired:l.isRequired}}),V=T(a,{global:!0});return delete V.id,delete V.onClick,j.createElement(X.label,{...C(V,o,S,I),ref:d,"data-selected":u||void 0,"data-pressed":n||void 0,"data-hovered":B||void 0,"data-focused":b||void 0,"data-focus-visible":R||void 0,"data-disabled":t||void 0,"data-readonly":l.isReadOnly||void 0,"data-invalid":l.isInvalid||void 0,"data-required":l.isRequired||void 0},j.createElement(Ge,{elementType:"span"},j.createElement("input",{...C(c,D),ref:v})),j.createElement(me.Provider,{value:{isSelected:u}},I.children))}),ee={"bui-RadioGroup":"_bui-RadioGroup_1tanw_20","bui-RadioGroupContent":"_bui-RadioGroupContent_1tanw_26","bui-Radio":"_bui-Radio_1tanw_20"},Te=U()({styles:ee,classNames:{root:"bui-RadioGroup",content:"bui-RadioGroupContent"},propDefs:{children:{},className:{},label:{},secondaryLabel:{},description:{},isRequired:{}}}),Ae=U()({styles:ee,classNames:{root:"bui-Radio"},propDefs:{className:{}}}),h=m.forwardRef((e,a)=>{const{ownProps:d,restProps:s}=K(Te,e),{classes:p,label:l,secondaryLabel:v,description:o,isRequired:c,children:u}=d,t=s["aria-label"],n=s["aria-labelledby"];m.useEffect(()=>{!l&&!t&&!n&&console.warn("RadioGroup requires either a visible label, aria-label, or aria-labelledby for accessibility")},[l,t,n]);const b=v||(c?"Required":null);return r.jsxs(Me,{className:p.root,...s,ref:a,children:[r.jsx(Be,{label:l,secondaryLabel:b,description:o,descriptionSlot:"description"}),r.jsx("div",{className:p.content,children:u}),r.jsx(Ie,{})]})});h.displayName="RadioGroup";const i=m.forwardRef((e,a)=>{const{ownProps:d,restProps:s}=K(Ae,e);return r.jsx(ke,{className:d.classes.root,...s,ref:a})});i.displayName="Radio";h.__docgenInfo={description:`A group of radio buttons for selecting a single option from a set, with an integrated label, description, and error display.

@public`,methods:[],displayName:"RadioGroup",props:{children:{required:!1,tsType:{name:"ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""},label:{required:!1,tsType:{name:"FieldLabelProps['label']",raw:"FieldLabelProps['label']"},description:""},secondaryLabel:{required:!1,tsType:{name:"FieldLabelProps['secondaryLabel']",raw:"FieldLabelProps['secondaryLabel']"},description:""},description:{required:!1,tsType:{name:"FieldLabelProps['description']",raw:"FieldLabelProps['description']"},description:""},isRequired:{required:!1,tsType:{name:"AriaRadioGroupProps['isRequired']",raw:"AriaRadioGroupProps['isRequired']"},description:""}},composes:["Omit"]};i.__docgenInfo={description:`A single radio button for use within a RadioGroup.

@public`,methods:[],displayName:"Radio",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const P=ie.meta({title:"Backstage UI/RadioGroup",component:h}),$=P.story({args:{label:"What is your favorite pokemon?"},render:e=>r.jsxs(h,{...e,children:[r.jsx(i,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(i,{value:"charmander",children:"Charmander"}),r.jsx(i,{value:"squirtle",children:"Squirtle"})]})}),_=P.story({args:{...$.input.args,description:"Choose only one option"},render:e=>r.jsxs(h,{...e,children:[r.jsx(i,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(i,{value:"charmander",children:"Charmander"}),r.jsx(i,{value:"squirtle",children:"Squirtle"})]})}),F=P.story({args:{...$.input.args,orientation:"horizontal"},render:e=>r.jsxs(h,{...e,children:[r.jsx(i,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(i,{value:"charmander",children:"Charmander"}),r.jsx(i,{value:"squirtle",children:"Squirtle"})]})}),L=P.story({args:{...$.input.args,isDisabled:!0},render:e=>r.jsxs(h,{...e,children:[r.jsx(i,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(i,{value:"charmander",children:"Charmander"}),r.jsx(i,{value:"squirtle",children:"Squirtle"})]})}),N=P.story({args:{...$.input.args},render:e=>r.jsxs(h,{...e,children:[r.jsx(i,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(i,{value:"charmander",isDisabled:!0,children:"Charmander"}),r.jsx(i,{value:"squirtle",children:"Squirtle"})]})}),O=P.story({args:{...$.input.args,value:"charmander"},render:e=>r.jsxs(h,{...e,children:[r.jsx(i,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(i,{value:"charmander",isDisabled:!0,children:"Charmander"}),r.jsx(i,{value:"squirtle",children:"Squirtle"})]})}),E=P.story({args:{...$.input.args,name:"pokemon",isInvalid:!0},render:e=>r.jsxs(h,{...e,children:[r.jsx(i,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(i,{value:"charmander",isDisabled:!0,children:"Charmander"}),r.jsx(i,{value:"squirtle",children:"Squirtle"})]})}),M=P.story({args:{...$.input.args,name:"pokemon",defaultValue:"charmander",validationBehavior:"aria",validate:e=>e==="charmander"?"Nice try!":null},render:e=>r.jsxs(h,{...e,children:[r.jsx(i,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(i,{value:"charmander",children:"Charmander"}),r.jsx(i,{value:"squirtle",children:"Squirtle"})]})}),k=P.story({args:{...$.input.args,isReadOnly:!0,defaultValue:"charmander"},render:e=>r.jsxs(h,{...e,children:[r.jsx(i,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(i,{value:"charmander",children:"Charmander"}),r.jsx(i,{value:"squirtle",children:"Squirtle"})]})});$.input.parameters={...$.input.parameters,docs:{...$.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'What is your favorite pokemon?'
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
})`,...$.input.parameters?.docs?.source}}};_.input.parameters={..._.input.parameters,docs:{..._.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    description: 'Choose only one option'
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
})`,..._.input.parameters?.docs?.source}}};F.input.parameters={...F.input.parameters,docs:{...F.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    orientation: 'horizontal'
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
})`,...F.input.parameters?.docs?.source}}};L.input.parameters={...L.input.parameters,docs:{...L.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isDisabled: true
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
})`,...L.input.parameters?.docs?.source}}};N.input.parameters={...N.input.parameters,docs:{...N.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander" isDisabled>
        Charmander
      </Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
})`,...N.input.parameters?.docs?.source}}};O.input.parameters={...O.input.parameters,docs:{...O.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    value: 'charmander'
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander" isDisabled>
        Charmander
      </Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
})`,...O.input.parameters?.docs?.source}}};E.input.parameters={...E.input.parameters,docs:{...E.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    name: 'pokemon',
    isInvalid: true
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander" isDisabled>
        Charmander
      </Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
})`,...E.input.parameters?.docs?.source}}};M.input.parameters={...M.input.parameters,docs:{...M.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    name: 'pokemon',
    defaultValue: 'charmander',
    validationBehavior: 'aria',
    validate: value => value === 'charmander' ? 'Nice try!' : null
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
})`,...M.input.parameters?.docs?.source}}};k.input.parameters={...k.input.parameters,docs:{...k.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isReadOnly: true,
    defaultValue: 'charmander'
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
})`,...k.input.parameters?.docs?.source}}};const fa=["Default","WithDescription","Horizontal","Disabled","DisabledSingle","DisabledAndSelected","Invalid","Validation","ReadOnly"];export{$ as Default,L as Disabled,O as DisabledAndSelected,N as DisabledSingle,F as Horizontal,E as Invalid,k as ReadOnly,M as Validation,_ as WithDescription,fa as __namedExportsOrder};
