import{r as p,a4 as S,j as r}from"./iframe-C4yti0TH.js";import{b as j,d as ee,$ as U,f as ae,g as re,c as K,i as ie,l as le,m as de,h as se}from"./utils-DEy88mMw.js";import{$ as oe}from"./FieldError-ChL302IZ.js";import{c as te,b as ne,a as ue}from"./Form-Cgg8Gb88.js";import{$ as ce}from"./Label-IweSkFuX.js";import{$ as be,a as fe,b as me}from"./SelectionIndicator-uAD1B4UV.js";import{b as ve,a as pe}from"./Text-DLqvZqOo.js";import{b as $e,a as w,$ as Re,f as he,d as xe,c as ge}from"./useFocusRing-B8apTfOm.js";import{$ as ye}from"./useControlledState-Cc-Gzoh9.js";import{$ as qe}from"./context-DU6HRt52.js";import{$ as Pe}from"./useFormReset-Cn51TXDN.js";import{a as H}from"./usePress-SnYWA32_.js";import{$ as De}from"./VisuallyHidden-HQQkOHyU.js";import{c as W}from"./clsx-B-dksMZM.js";import{u as J}from"./useStyles-BVvzKC4H.js";import{F as Se}from"./FieldLabel-DzhiGaDu.js";import{F as je}from"./FieldError-WvdOj_lr.js";import"./preload-helper-D9Z9MdNV.js";import"./Hidden-COSJl_dh.js";import"./useLabels-Bw3k7E9a.js";const Q=new WeakMap;function Ve(e,a,i){let{value:s,children:c,"aria-label":o,"aria-labelledby":$,onPressStart:d,onPressEnd:b,onPressChange:n,onPress:t,onPressUp:u,onClick:m}=e;const f=e.isDisabled||a.isDisabled;let P=a.selectedValue===s,q=C=>{C.stopPropagation(),a.setSelectedValue(s)},{pressProps:D,isPressed:B}=H({onPressStart:d,onPressEnd:b,onPressChange:n,onPress:t,onPressUp:u,onClick:m,isDisabled:f}),{pressProps:G,isPressed:V}=H({onPressStart:d,onPressEnd:b,onPressChange:n,onPressUp:u,onClick:m,isDisabled:f,onPress(C){var T;t?.(C),a.setSelectedValue(s),(T=i.current)===null||T===void 0||T.focus()}}),{focusableProps:L}=$e(j(e,{onFocus:()=>a.setLastFocusedValue(s)}),i),y=j(D,L),v=w(e,{labelable:!0}),h=-1;a.selectedValue!=null?a.selectedValue===s&&(h=0):(a.lastFocusedValue===s||a.lastFocusedValue==null)&&(h=0),f&&(h=void 0);let{name:x,form:I,descriptionId:Y,errorMessageId:Z,validationBehavior:z}=Q.get(a);return Pe(i,a.defaultSelectedValue,a.setSelectedValue),te({validationBehavior:z},a,i),{labelProps:j(G,p.useMemo(()=>({onClick:C=>C.preventDefault(),onMouseDown:C=>C.preventDefault()}),[])),inputProps:j(v,{...y,type:"radio",name:x,form:I,tabIndex:h,disabled:f,required:a.isRequired&&z==="native",checked:P,value:s,onChange:q,"aria-describedby":[e["aria-describedby"],a.isInvalid?Z:null,Y].filter(Boolean).join(" ")||void 0}),isDisabled:f,isSelected:P,isPressed:B||V}}function Ce(e,a){let{name:i,form:s,isReadOnly:c,isRequired:o,isDisabled:$,orientation:d="vertical",validationBehavior:b="aria"}=e,{direction:n}=qe(),{isInvalid:t,validationErrors:u,validationDetails:m}=a.displayValidation,{labelProps:f,fieldProps:P,descriptionProps:q,errorMessageProps:D}=ve({...e,labelElementType:"span",isInvalid:a.isInvalid,errorMessage:e.errorMessage||u}),B=w(e,{labelable:!0}),{focusWithinProps:G}=Re({onBlurWithin(y){var v;(v=e.onBlur)===null||v===void 0||v.call(e,y),a.selectedValue||a.setLastFocusedValue(null)},onFocusWithin:e.onFocus,onFocusWithinChange:e.onFocusChange}),V=y=>{let v;switch(y.key){case"ArrowRight":n==="rtl"&&d!=="vertical"?v="prev":v="next";break;case"ArrowLeft":n==="rtl"&&d!=="vertical"?v="next":v="prev";break;case"ArrowDown":v="next";break;case"ArrowUp":v="prev";break;default:return}y.preventDefault();let h=be(y.currentTarget,{from:y.target,accept:I=>I instanceof he(I).HTMLInputElement&&I.type==="radio"}),x;v==="next"?(x=h.nextNode(),x||(h.currentNode=y.currentTarget,x=h.firstChild())):(x=h.previousNode(),x||(h.currentNode=y.currentTarget,x=h.lastChild())),x&&(x.focus(),a.setSelectedValue(x.value))},L=ee(i);return Q.set(a,{name:L,form:s,descriptionId:q.id,errorMessageId:D.id,validationBehavior:b}),{radioGroupProps:j(B,{role:"radiogroup",onKeyDown:V,"aria-invalid":a.isInvalid||void 0,"aria-errormessage":e["aria-errormessage"],"aria-readonly":c||void 0,"aria-required":o||void 0,"aria-disabled":$||void 0,"aria-orientation":d,...P,...G}),labelProps:f,descriptionProps:q,errorMessageProps:D,isInvalid:t,validationErrors:u,validationDetails:m}}let Be=Math.round(Math.random()*1e10),Ge=0;function Ie(e){let a=p.useMemo(()=>e.name||`radio-group-${Be}-${++Ge}`,[e.name]);var i;let[s,c]=ye(e.value,(i=e.defaultValue)!==null&&i!==void 0?i:null,e.onChange),[o]=p.useState(s),[$,d]=p.useState(null),b=ne({...e,value:s}),n=m=>{!e.isReadOnly&&!e.isDisabled&&(c(m),b.commitValidation())},t=b.displayValidation.isInvalid;var u;return{...b,name:a,selectedValue:s,defaultSelectedValue:e.value!==void 0?o:(u=e.defaultValue)!==null&&u!==void 0?u:null,setSelectedValue:n,lastFocusedValue:$,setLastFocusedValue:d,isDisabled:e.isDisabled||!1,isReadOnly:e.isReadOnly||!1,isRequired:e.isRequired||!1,validationState:e.validationState||(t?"invalid":null),isInvalid:t}}const _e=p.createContext(null),Ne=p.createContext(null),X=p.createContext(null),Oe=p.forwardRef(function(a,i){[a,i]=U(a,i,_e);let{validationBehavior:s}=ae(ue)||{};var c,o;let $=(o=(c=a.validationBehavior)!==null&&c!==void 0?c:s)!==null&&o!==void 0?o:"native",d=Ie({...a,validationBehavior:$}),[b,n]=re(!a["aria-label"]&&!a["aria-labelledby"]),{radioGroupProps:t,labelProps:u,descriptionProps:m,errorMessageProps:f,...P}=Ce({...a,label:n,validationBehavior:$},d),q=K({...a,values:{orientation:a.orientation||"vertical",isDisabled:d.isDisabled,isReadOnly:d.isReadOnly,isRequired:d.isRequired,isInvalid:d.isInvalid,state:d},defaultClassName:"react-aria-RadioGroup"}),D=w(a,{global:!0});return S.createElement("div",{...j(D,q,t),ref:i,slot:a.slot||void 0,"data-orientation":a.orientation||"vertical","data-invalid":d.isInvalid||void 0,"data-disabled":d.isDisabled||void 0,"data-readonly":d.isReadOnly||void 0,"data-required":d.isRequired||void 0},S.createElement(ie,{values:[[X,d],[ce,{...u,ref:b,elementType:"span"}],[pe,{slots:{description:m,errorMessage:f}}],[oe,P]]},S.createElement(fe,null,q.children)))}),Ee=p.forwardRef(function(a,i){let{inputRef:s=null,...c}=a;[a,i]=U(c,i,Ne);let o=S.useContext(X),$=le(p.useMemo(()=>de(s,a.inputRef!==void 0?a.inputRef:null),[s,a.inputRef])),{labelProps:d,inputProps:b,isSelected:n,isDisabled:t,isPressed:u}=Ve({...se(a),children:typeof a.children=="function"?!0:a.children},o,$),{isFocused:m,isFocusVisible:f,focusProps:P}=xe(),q=t||o.isReadOnly,{hoverProps:D,isHovered:B}=ge({...a,isDisabled:q}),G=K({...a,defaultClassName:"react-aria-Radio",values:{isSelected:n,isPressed:u,isHovered:B,isFocused:m,isFocusVisible:f,isDisabled:t,isReadOnly:o.isReadOnly,isInvalid:o.isInvalid,isRequired:o.isRequired}}),V=w(a,{global:!0});return delete V.id,delete V.onClick,S.createElement("label",{...j(V,d,D,G),ref:i,"data-selected":n||void 0,"data-pressed":u||void 0,"data-hovered":B||void 0,"data-focused":m||void 0,"data-focus-visible":f||void 0,"data-disabled":t||void 0,"data-readonly":o.isReadOnly||void 0,"data-invalid":o.isInvalid||void 0,"data-required":o.isRequired||void 0},S.createElement(De,{elementType:"span"},S.createElement("input",{...j(b,P),ref:$})),S.createElement(me.Provider,{value:{isSelected:n}},G.children))}),A={"bui-RadioGroup":"_bui-RadioGroup_1fivl_20","bui-RadioGroupContent":"_bui-RadioGroupContent_1fivl_26","bui-Radio":"_bui-Radio_1fivl_20"},R=p.forwardRef((e,a)=>{const{classNames:i,cleanedProps:s}=J("RadioGroup",e),{className:c,label:o,secondaryLabel:$,description:d,isRequired:b,"aria-label":n,"aria-labelledby":t,children:u,...m}=s;p.useEffect(()=>{!o&&!n&&!t&&console.warn("RadioGroup requires either a visible label, aria-label, or aria-labelledby for accessibility")},[o,n,t]);const f=$||(b?"Required":null);return r.jsxs(Oe,{className:W(i.root,A[i.root],c),"aria-label":n,"aria-labelledby":t,...m,ref:a,children:[r.jsx(Se,{label:o,secondaryLabel:f,description:d}),r.jsx("div",{className:W(i.content,A[i.content]),children:u}),r.jsx(je,{})]})});R.displayName="RadioGroup";const l=p.forwardRef((e,a)=>{const{className:i,...s}=e,{classNames:c}=J("RadioGroup");return r.jsx(Ee,{className:W(c.radio,A[c.radio],i),...s,ref:a})});R.displayName="RadioGroup";R.__docgenInfo={description:"@public",methods:[],displayName:"RadioGroup",props:{children:{required:!1,tsType:{name:"ReactNode"},description:""}},composes:["Omit"]};l.__docgenInfo={description:"@public",methods:[],displayName:"Radio",composes:["AriaRadioProps"]};const ia={title:"Backstage UI/RadioGroup",component:R},g={args:{label:"What is your favorite pokemon?"},render:e=>r.jsxs(R,{...e,children:[r.jsx(l,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(l,{value:"charmander",children:"Charmander"}),r.jsx(l,{value:"squirtle",children:"Squirtle"})]})},_={args:{...g.args,orientation:"horizontal"},render:e=>r.jsxs(R,{...e,children:[r.jsx(l,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(l,{value:"charmander",children:"Charmander"}),r.jsx(l,{value:"squirtle",children:"Squirtle"})]})},N={args:{...g.args,isDisabled:!0},render:e=>r.jsxs(R,{...e,children:[r.jsx(l,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(l,{value:"charmander",children:"Charmander"}),r.jsx(l,{value:"squirtle",children:"Squirtle"})]})},O={args:{...g.args},render:e=>r.jsxs(R,{...e,children:[r.jsx(l,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(l,{value:"charmander",isDisabled:!0,children:"Charmander"}),r.jsx(l,{value:"squirtle",children:"Squirtle"})]})},E={args:{...g.args,value:"charmander"},render:e=>r.jsxs(R,{...e,children:[r.jsx(l,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(l,{value:"charmander",isDisabled:!0,children:"Charmander"}),r.jsx(l,{value:"squirtle",children:"Squirtle"})]})},F={args:{...g.args,name:"pokemon",isInvalid:!0},render:e=>r.jsxs(R,{...e,children:[r.jsx(l,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(l,{value:"charmander",isDisabled:!0,children:"Charmander"}),r.jsx(l,{value:"squirtle",children:"Squirtle"})]})},M={args:{...g.args,name:"pokemon",defaultValue:"charmander",validationBehavior:"aria",validate:e=>e==="charmander"?"Nice try!":null},render:e=>r.jsxs(R,{...e,children:[r.jsx(l,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(l,{value:"charmander",children:"Charmander"}),r.jsx(l,{value:"squirtle",children:"Squirtle"})]})},k={args:{...g.args,isReadOnly:!0,defaultValue:"charmander"},render:e=>r.jsxs(R,{...e,children:[r.jsx(l,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(l,{value:"charmander",children:"Charmander"}),r.jsx(l,{value:"squirtle",children:"Squirtle"})]})};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'What is your favorite pokemon?'
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
}`,...g.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    orientation: 'horizontal'
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
}`,..._.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    isDisabled: true
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
}`,...N.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander" isDisabled>
        Charmander
      </Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
}`,...O.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    value: 'charmander'
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander" isDisabled>
        Charmander
      </Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
}`,...E.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
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
}`,...F.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
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
}`,...M.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    isReadOnly: true,
    defaultValue: 'charmander'
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
}`,...k.parameters?.docs?.source}}};const la=["Default","Horizontal","Disabled","DisabledSingle","DisabledAndSelected","Invalid","Validation","ReadOnly"];export{g as Default,N as Disabled,E as DisabledAndSelected,O as DisabledSingle,_ as Horizontal,F as Invalid,k as ReadOnly,M as Validation,la as __namedExportsOrder,ia as default};
