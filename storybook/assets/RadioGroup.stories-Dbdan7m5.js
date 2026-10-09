import{r as n,R as y,aO as K,aP as Q,j as r,p as se}from"./iframe-D_sJ6DQq.js";import{$ as X,c as oe,d as te,b as Y,a as Z,f as de,e as le}from"./utils-rcqHDtde.js";import{$ as ne}from"./FieldError-CD2mDzmR.js";import{a as ue}from"./Form-BXoeFdX8.js";import{$ as ce}from"./Label-CqUgdJka.js";import{$ as pe,b as be}from"./FocusScope-CdP29dN2.js";import{a as fe}from"./Text-CukGZgZw.js";import{$ as me,a as _,k as ve,A as $e,i as Re,d as he,j as xe}from"./useFocusRing-DDwhFymc.js";import{b as S,d as ge,$ as ye,a as qe}from"./useObjectRef-C71_ODYl.js";import{$ as Pe}from"./useFormReset-DHxzgEZr.js";import{b as De,a as Se}from"./useFormValidation-CZ1LA-b2.js";import{$ as J}from"./usePress-LFrjKvgu.js";import{$ as je}from"./useSlot-P7nqlEYX.js";import{$ as Ce}from"./useField-gSzBaL8y.js";import{$ as Ge}from"./I18nProvider-Bnu7qnYs.js";import{$ as Ve}from"./useControlledState-F0ZESx8Q.js";import{$ as Be}from"./useHover-CC1tHz-Y.js";import{a as Ie}from"./VisuallyHidden-Blk8A0BW.js";import{F as Fe}from"./FieldLabel-D2twxKYA.js";import{F as Le}from"./FieldError-_EroCQCO.js";import"./preload-helper-PPVm8Dsz.js";import"./Hidden-B0JsmZw6.js";import"./openLink-DVi3OW0T.js";import"./textSelection-5Cu1iBDL.js";import"./getMetaValue-DT9wVw6b.js";import"./useLabel-JU3kQl_C.js";import"./useLabels-CtqB2Ot9.js";const ee=new WeakMap;function Ne(e,a,o){let{value:t,children:c,"aria-label":s,"aria-labelledby":u,onPressStart:d,onPressEnd:m,onPressChange:p,onPress:l,onPressUp:b,onClick:h}=e;const v=e.isDisabled||a.isDisabled;let P=a.selectedValue===t,V=G=>{G.stopPropagation(),a.setSelectedValue(t)},{pressProps:j,isPressed:B}=J({onPressStart:d,onPressEnd:m,onPressChange:p,onPress:l,onPressUp:b,onClick:h,isDisabled:v}),{pressProps:C,isPressed:I}=J({onPressStart:d,onPressEnd:m,onPressChange:p,onPressUp:b,onClick:h,isDisabled:v,onPress(G){l?.(G),a.setSelectedValue(t),o.current?.focus()}}),{focusableProps:A}=me(S(e,{onFocus:()=>a.setLastFocusedValue(t)}),o),W=S(j,A),f=_(e,{labelable:!0}),x=-1;a.selectedValue!=null?a.selectedValue===t&&(x=0):(a.lastFocusedValue===t||a.lastFocusedValue==null)&&(x=0),v&&(x=void 0);let{name:D,form:g,descriptionId:F,errorMessageId:ie,validationBehavior:H}=ee.get(a);Pe(o,a.defaultSelectedValue,a.setSelectedValue),De({validationBehavior:H},a,o);let U=je();return{labelProps:S(C,n.useMemo(()=>({onClick:G=>G.preventDefault(),onMouseDown:G=>G.preventDefault()}),[])),inputProps:S(f,{...W,type:"radio",name:D,form:g,tabIndex:x,disabled:v,required:a.isRequired&&H==="native",checked:P,value:t,onChange:V,"aria-describedby":[e["aria-describedby"],U.id,a.isInvalid?ie:null,F].filter(Boolean).join(" ")||void 0}),descriptionProps:U,isDisabled:v,isSelected:P,isPressed:B||I}}function we(e,a){let{name:o,form:t,isReadOnly:c,isRequired:s,isDisabled:u,orientation:d="vertical",validationBehavior:m="aria"}=e,{direction:p}=Ge(),{isInvalid:l,validationErrors:b,validationDetails:h}=a.displayValidation,{labelProps:v,fieldProps:P,descriptionProps:V,errorMessageProps:j}=Ce({...e,labelElementType:"span",isInvalid:a.isInvalid,errorMessage:e.errorMessage||b}),B=_(e,{labelable:!0}),{focusWithinProps:C}=ve({onBlurWithin(f){e.onBlur?.(f),a.selectedValue||a.setLastFocusedValue(null)},onFocusWithin:e.onFocus,onFocusWithinChange:e.onFocusChange});function I(f,x){let D=pe(x.currentTarget,{from:he(x),accept:F=>F instanceof Re(F).HTMLInputElement&&F.type==="radio"}),g;return f==="next"?(g=D.nextNode(),g||(D.currentNode=x.currentTarget,g=D.firstChild())):(g=D.previousNode(),g||(D.currentNode=x.currentTarget,g=D.lastChild())),g?(g.focus(),a.setSelectedValue(g.value),!0):!1}let{keyboardProps:A}=$e({shortcuts:{ArrowRight:f=>I(p==="rtl"&&d!=="vertical"?"prev":"next",f),ArrowLeft:f=>I(p==="rtl"&&d!=="vertical"?"next":"prev",f),ArrowDown:f=>I("next",f),ArrowUp:f=>I("prev",f)},allowRepeats:!0}),W=ge(o);return ee.set(a,{name:W,form:t,descriptionId:V.id,errorMessageId:j.id,validationBehavior:m}),{radioGroupProps:S(B,{role:"radiogroup",...A,"aria-invalid":a.isInvalid||void 0,"aria-errormessage":e["aria-errormessage"],"aria-readonly":c||void 0,"aria-required":s||void 0,"aria-disabled":u||void 0,"aria-orientation":d,...P,...C}),labelProps:v,descriptionProps:V,errorMessageProps:j,isInvalid:l,validationErrors:b,validationDetails:h}}let Oe=Math.round(Math.random()*1e10),Ee=0;function Me(e){let a=n.useMemo(()=>e.name||`radio-group-${Oe}-${++Ee}`,[e.name]),[o,t]=Ve(e.value,e.defaultValue??null,e.onChange),[c]=n.useState(o),[s,u]=n.useState(null),d=Se({...e,value:o}),m=l=>{!e.isReadOnly&&!e.isDisabled&&(t(l),d.commitValidation())},p=d.displayValidation.isInvalid;return{...d,name:a,selectedValue:o,defaultSelectedValue:e.value!==void 0?c:e.defaultValue??null,setSelectedValue:m,lastFocusedValue:s,setLastFocusedValue:u,isDisabled:e.isDisabled||!1,isReadOnly:e.isReadOnly||!1,isRequired:e.isRequired||!1,validationState:e.validationState||(p?"invalid":null),isInvalid:p}}const ke=n.createContext(null),Te=n.createContext(null),z=n.createContext(null),_e=n.forwardRef(function(a,o){[a,o]=X(a,o,ke);let{validationBehavior:t}=oe(ue)||{},c=a.validationBehavior??t??"native",s=Me({...a,validationBehavior:c}),[u,d]=te(!a["aria-label"]&&!a["aria-labelledby"]),{radioGroupProps:m,labelProps:p,descriptionProps:l,errorMessageProps:b,...h}=we({...a,label:d,validationBehavior:c},s),v=Y({...a,values:{orientation:a.orientation||"vertical",isDisabled:s.isDisabled,isReadOnly:s.isReadOnly,isRequired:s.isRequired,isInvalid:s.isInvalid,state:s},defaultClassName:"react-aria-RadioGroup"}),P=_(a,{global:!0});return y.createElement(Z.div,{...S(P,v,m),ref:o,slot:a.slot||void 0,"data-orientation":a.orientation||"vertical","data-invalid":s.isInvalid||void 0,"data-disabled":s.isDisabled||void 0,"data-readonly":s.isReadOnly||void 0,"data-required":s.isRequired||void 0},y.createElement(de,{values:[[z,s],[ce,{...p,ref:u,elementType:"span"}],[fe,{slots:{description:l,errorMessage:b}}],[ne,h]]},y.createElement(be,null,v.children)))}),Ae=n.forwardRef(function(a,o){let{inputRef:t=null,...c}=a;[a,o]=X(c,o,Te);let s=y.useContext(z),u=ye(n.useMemo(()=>qe(t,a.inputRef!==void 0?a.inputRef:null),[t,a.inputRef])),d=Ne({...le(a),children:typeof a.children=="function"?!0:a.children},s,u);return y.createElement(ae.Provider,{value:{...d,inputRef:u,defaultClassName:"react-aria-Radio"}},y.createElement(We,{...a,ref:o}))}),ae=n.createContext(null),We=n.forwardRef(function(a,o){let{labelProps:t,inputProps:c,isSelected:s,isDisabled:u,isPressed:d,defaultClassName:m,inputRef:p}=n.useContext(ae),l=y.useContext(z),{isFocused:b,isFocusVisible:h,focusProps:v}=xe(),P=u||l.isReadOnly,{hoverProps:V,isHovered:j}=Be({...a,isDisabled:P}),B=Y({...a,defaultClassName:m,values:{isSelected:s,isPressed:d,isHovered:j,isFocused:b,isFocusVisible:h,isDisabled:u,isReadOnly:l.isReadOnly,isInvalid:l.isInvalid,isRequired:l.isRequired}}),C=_(a,{global:!0});return delete C.id,delete C.onClick,y.createElement(Z.label,{...S(C,t,V,B),ref:o,"data-selected":s||void 0,"data-pressed":d||void 0,"data-hovered":j||void 0,"data-focused":b||void 0,"data-focus-visible":h||void 0,"data-disabled":u||void 0,"data-readonly":l.isReadOnly||void 0,"data-invalid":l.isInvalid||void 0,"data-required":l.isRequired||void 0},y.createElement(Ie,{elementType:"span"},y.createElement("input",{...S(c,v),ref:p})),B.children)}),re={"bui-RadioGroup":"_bui-RadioGroup_136mu_20","bui-RadioGroupContent":"_bui-RadioGroupContent_136mu_26","bui-Radio":"_bui-Radio_136mu_20"},ze=K()({styles:re,classNames:{root:"bui-RadioGroup",content:"bui-RadioGroupContent"},propDefs:{children:{},className:{},label:{},secondaryLabel:{},description:{},isRequired:{}}}),He=K()({styles:re,classNames:{root:"bui-Radio"},propDefs:{className:{}}}),R=n.forwardRef((e,a)=>{const{ownProps:o,restProps:t}=Q(ze,e),{classes:c,label:s,secondaryLabel:u,description:d,isRequired:m,children:p}=o,l=t["aria-label"],b=t["aria-labelledby"];n.useEffect(()=>{!s&&!l&&!b&&console.warn("RadioGroup requires either a visible label, aria-label, or aria-labelledby for accessibility")},[s,l,b]);const h=u||(m?"Required":null);return r.jsxs(_e,{className:c.root,...t,ref:a,children:[r.jsx(Fe,{label:s,secondaryLabel:h,description:d,descriptionSlot:"description"}),r.jsx("div",{className:c.content,children:p}),r.jsx(Le,{})]})});R.displayName="RadioGroup";const i=n.forwardRef((e,a)=>{const{ownProps:o,restProps:t}=Q(He,e);return r.jsx(Ae,{className:o.classes.root,...t,ref:a})});i.displayName="Radio";R.__docgenInfo={description:`A group of radio buttons for selecting a single option from a set, with an integrated label, description, and error display.

@public`,methods:[],displayName:"RadioGroup",props:{children:{required:!1,tsType:{name:"ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""},label:{required:!1,tsType:{name:"FieldLabelProps['label']",raw:"FieldLabelProps['label']"},description:""},secondaryLabel:{required:!1,tsType:{name:"FieldLabelProps['secondaryLabel']",raw:"FieldLabelProps['secondaryLabel']"},description:""},description:{required:!1,tsType:{name:"FieldLabelProps['description']",raw:"FieldLabelProps['description']"},description:""},isRequired:{required:!1,tsType:{name:"AriaRadioGroupProps['isRequired']",raw:"AriaRadioGroupProps['isRequired']"},description:""}},composes:["Omit"]};i.__docgenInfo={description:`A single radio button for use within a RadioGroup.

@public`,methods:[],displayName:"Radio",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const q=se.meta({title:"Backstage UI/RadioGroup",component:R}),$=q.story({args:{label:"What is your favorite pokemon?"},render:e=>r.jsxs(R,{...e,children:[r.jsx(i,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(i,{value:"charmander",children:"Charmander"}),r.jsx(i,{value:"squirtle",children:"Squirtle"})]})}),L=q.story({args:{...$.input.args,description:"Choose only one option"},render:e=>r.jsxs(R,{...e,children:[r.jsx(i,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(i,{value:"charmander",children:"Charmander"}),r.jsx(i,{value:"squirtle",children:"Squirtle"})]})}),N=q.story({args:{...$.input.args,orientation:"horizontal"},render:e=>r.jsxs(R,{...e,children:[r.jsx(i,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(i,{value:"charmander",children:"Charmander"}),r.jsx(i,{value:"squirtle",children:"Squirtle"})]})}),w=q.story({args:{...$.input.args,isDisabled:!0},render:e=>r.jsxs(R,{...e,children:[r.jsx(i,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(i,{value:"charmander",children:"Charmander"}),r.jsx(i,{value:"squirtle",children:"Squirtle"})]})}),O=q.story({args:{...$.input.args},render:e=>r.jsxs(R,{...e,children:[r.jsx(i,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(i,{value:"charmander",isDisabled:!0,children:"Charmander"}),r.jsx(i,{value:"squirtle",children:"Squirtle"})]})}),E=q.story({args:{...$.input.args,value:"charmander"},render:e=>r.jsxs(R,{...e,children:[r.jsx(i,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(i,{value:"charmander",isDisabled:!0,children:"Charmander"}),r.jsx(i,{value:"squirtle",children:"Squirtle"})]})}),M=q.story({args:{...$.input.args,name:"pokemon",isInvalid:!0},render:e=>r.jsxs(R,{...e,children:[r.jsx(i,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(i,{value:"charmander",isDisabled:!0,children:"Charmander"}),r.jsx(i,{value:"squirtle",children:"Squirtle"})]})}),k=q.story({args:{...$.input.args,name:"pokemon",defaultValue:"charmander",validationBehavior:"aria",validate:e=>e==="charmander"?"Nice try!":null},render:e=>r.jsxs(R,{...e,children:[r.jsx(i,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(i,{value:"charmander",children:"Charmander"}),r.jsx(i,{value:"squirtle",children:"Squirtle"})]})}),T=q.story({args:{...$.input.args,isReadOnly:!0,defaultValue:"charmander"},render:e=>r.jsxs(R,{...e,children:[r.jsx(i,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(i,{value:"charmander",children:"Charmander"}),r.jsx(i,{value:"squirtle",children:"Squirtle"})]})});$.input.parameters={...$.input.parameters,docs:{...$.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'What is your favorite pokemon?'
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
})`,...$.input.parameters?.docs?.source}}};L.input.parameters={...L.input.parameters,docs:{...L.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    description: 'Choose only one option'
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
})`,...L.input.parameters?.docs?.source}}};N.input.parameters={...N.input.parameters,docs:{...N.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    orientation: 'horizontal'
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
})`,...N.input.parameters?.docs?.source}}};w.input.parameters={...w.input.parameters,docs:{...w.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isDisabled: true
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
})`,...w.input.parameters?.docs?.source}}};O.input.parameters={...O.input.parameters,docs:{...O.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...O.input.parameters?.docs?.source}}};E.input.parameters={...E.input.parameters,docs:{...E.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...E.input.parameters?.docs?.source}}};M.input.parameters={...M.input.parameters,docs:{...M.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...M.input.parameters?.docs?.source}}};k.input.parameters={...k.input.parameters,docs:{...k.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...k.input.parameters?.docs?.source}}};T.input.parameters={...T.input.parameters,docs:{...T.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...T.input.parameters?.docs?.source}}};const xa=["Default","WithDescription","Horizontal","Disabled","DisabledSingle","DisabledAndSelected","Invalid","Validation","ReadOnly"];export{$ as Default,w as Disabled,E as DisabledAndSelected,O as DisabledSingle,N as Horizontal,M as Invalid,T as ReadOnly,k as Validation,L as WithDescription,xa as __namedExportsOrder};
