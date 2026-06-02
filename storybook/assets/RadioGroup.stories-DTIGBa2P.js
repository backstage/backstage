import{ca as p,T as D,bg as z,cH as U,bR as r,c7 as re}from"./iframe-DogXi1kP.js";import{a as K,g as ie,c as se,b as J,e as Q,$ as oe,f as de}from"./utils-AxfqVSE9.js";import{a as le}from"./FieldError-CzpSx-Mx.js";import{$ as te,g as ne,b as ue}from"./useFormValidation-BIYlJHZ1.js";import{$ as ce}from"./Label-BT3yvL3F.js";import{b as pe,e as be,f as fe}from"./FocusScope-C_GT869N.js";import{a as me}from"./Text-BRIb-OAb.js";import{A as ve,m as _,g as Re,D as $e,f as he,a as ge}from"./useFocusRing-mENG_ikp.js";import{e as S,b as xe,$ as ye,c as qe}from"./useObjectRef-UHrM_yCs.js";import{$ as Pe}from"./useFormReset-CXIeSoiQ.js";import{b as H}from"./usePress-PepYZ5yJ.js";import{$ as De}from"./useField-DTPdncVL.js";import{$ as Se}from"./I18nProvider-Cag9fozJ.js";import{$ as je}from"./useControlledState-CrzRLYRc.js";import{$ as Ce}from"./useHover-ox9S2Piy.js";import{$ as Ge}from"./VisuallyHidden-BwKEPC3N.js";import{F as Ve}from"./FieldLabel-DFPXv5Zo.js";import{F as Be}from"./FieldError-VyUtu5uM.js";import"./preload-helper-PPVm8Dsz.js";import"./Hidden-CYdnfqbh.js";import"./openLink-CxuZpafj.js";import"./textSelection-QdGxsqrV.js";import"./useLabel-DvnqIlMC.js";import"./useLabels-DnC-SBWU.js";const X=new WeakMap;function Ie(e,a,o){let{value:d,children:b,"aria-label":i,"aria-labelledby":R,onPressStart:l,onPressEnd:f,onPressChange:t,onPress:n,onPressUp:u,onClick:$}=e;const c=e.isDisabled||a.isDisabled;let P=a.selectedValue===d,G=C=>{C.stopPropagation(),a.setSelectedValue(d)},{pressProps:V,isPressed:B}=H({onPressStart:l,onPressEnd:f,onPressChange:t,onPress:n,onPressUp:u,onClick:$,isDisabled:c}),{pressProps:I,isPressed:j}=H({onPressStart:l,onPressEnd:f,onPressChange:t,onPressUp:u,onClick:$,isDisabled:c,onPress(C){n?.(C),a.setSelectedValue(d),o.current?.focus()}}),{focusableProps:A}=ve(S(e,{onFocus:()=>a.setLastFocusedValue(d)}),o),x=S(V,A),y=_(e,{labelable:!0}),h=-1;a.selectedValue!=null?a.selectedValue===d&&(h=0):(a.lastFocusedValue===d||a.lastFocusedValue==null)&&(h=0),c&&(h=void 0);let{name:g,form:w,descriptionId:ee,errorMessageId:ae,validationBehavior:W}=X.get(a);return Pe(o,a.defaultSelectedValue,a.setSelectedValue),te({validationBehavior:W},a,o),{labelProps:S(I,p.useMemo(()=>({onClick:C=>C.preventDefault(),onMouseDown:C=>C.preventDefault()}),[])),inputProps:S(y,{...x,type:"radio",name:g,form:w,tabIndex:h,disabled:c,required:a.isRequired&&W==="native",checked:P,value:d,onChange:G,"aria-describedby":[e["aria-describedby"],a.isInvalid?ae:null,ee].filter(Boolean).join(" ")||void 0}),isDisabled:c,isSelected:P,isPressed:B||j}}function we(e,a){let{name:o,form:d,isReadOnly:b,isRequired:i,isDisabled:R,orientation:l="vertical",validationBehavior:f="aria"}=e,{direction:t}=Se(),{isInvalid:n,validationErrors:u,validationDetails:$}=a.displayValidation,{labelProps:c,fieldProps:P,descriptionProps:G,errorMessageProps:V}=De({...e,labelElementType:"span",isInvalid:a.isInvalid,errorMessage:e.errorMessage||u}),B=_(e,{labelable:!0}),{focusWithinProps:I}=Re({onBlurWithin(x){e.onBlur?.(x),a.selectedValue||a.setLastFocusedValue(null)},onFocusWithin:e.onFocus,onFocusWithinChange:e.onFocusChange}),j=x=>{let y;switch(x.key){case"ArrowRight":t==="rtl"&&l!=="vertical"?y="prev":y="next";break;case"ArrowLeft":t==="rtl"&&l!=="vertical"?y="next":y="prev";break;case"ArrowDown":y="next";break;case"ArrowUp":y="prev";break;default:return}x.preventDefault();let h=pe(x.currentTarget,{from:he(x),accept:w=>w instanceof $e(w).HTMLInputElement&&w.type==="radio"}),g;y==="next"?(g=h.nextNode(),g||(h.currentNode=x.currentTarget,g=h.firstChild())):(g=h.previousNode(),g||(h.currentNode=x.currentTarget,g=h.lastChild())),g&&(g.focus(),a.setSelectedValue(g.value))},A=xe(o);return X.set(a,{name:A,form:d,descriptionId:G.id,errorMessageId:V.id,validationBehavior:f}),{radioGroupProps:S(B,{role:"radiogroup",onKeyDown:j,"aria-invalid":a.isInvalid||void 0,"aria-errormessage":e["aria-errormessage"],"aria-readonly":b||void 0,"aria-required":i||void 0,"aria-disabled":R||void 0,"aria-orientation":l,...P,...I}),labelProps:c,descriptionProps:G,errorMessageProps:V,isInvalid:n,validationErrors:u,validationDetails:$}}let Fe=Math.round(Math.random()*1e10),Le=0;function Ne(e){let a=p.useMemo(()=>e.name||`radio-group-${Fe}-${++Le}`,[e.name]),[o,d]=je(e.value,e.defaultValue??null,e.onChange),[b]=p.useState(o),[i,R]=p.useState(null),l=ne({...e,value:o}),f=n=>{!e.isReadOnly&&!e.isDisabled&&(d(n),l.commitValidation())},t=l.displayValidation.isInvalid;return{...l,name:a,selectedValue:o,defaultSelectedValue:e.value!==void 0?b:e.defaultValue??null,setSelectedValue:f,lastFocusedValue:i,setLastFocusedValue:R,isDisabled:e.isDisabled||!1,isReadOnly:e.isReadOnly||!1,isRequired:e.isRequired||!1,validationState:e.validationState||(t?"invalid":null),isInvalid:t}}const Oe=p.createContext(null),Ee=p.createContext(null),Y=p.createContext(null),Me=p.forwardRef(function(a,o){[a,o]=K(a,o,Oe);let{validationBehavior:d}=ie(ue)||{},b=a.validationBehavior??d??"native",i=Ne({...a,validationBehavior:b}),[R,l]=se(!a["aria-label"]&&!a["aria-labelledby"]),{radioGroupProps:f,labelProps:t,descriptionProps:n,errorMessageProps:u,...$}=we({...a,label:l,validationBehavior:b},i),c=J({...a,values:{orientation:a.orientation||"vertical",isDisabled:i.isDisabled,isReadOnly:i.isReadOnly,isRequired:i.isRequired,isInvalid:i.isInvalid,state:i},defaultClassName:"react-aria-RadioGroup"}),P=_(a,{global:!0});return D.createElement(Q.div,{...S(P,c,f),ref:o,slot:a.slot||void 0,"data-orientation":a.orientation||"vertical","data-invalid":i.isInvalid||void 0,"data-disabled":i.isDisabled||void 0,"data-readonly":i.isReadOnly||void 0,"data-required":i.isRequired||void 0},D.createElement(oe,{values:[[Y,i],[ce,{...t,ref:R,elementType:"span"}],[me,{slots:{description:n,errorMessage:u}}],[le,$]]},D.createElement(be,null,c.children)))}),ke=p.forwardRef(function(a,o){let{inputRef:d=null,...b}=a;[a,o]=K(b,o,Ee);let i=D.useContext(Y),R=ye(p.useMemo(()=>qe(d,a.inputRef!==void 0?a.inputRef:null),[d,a.inputRef])),{labelProps:l,inputProps:f,isSelected:t,isDisabled:n,isPressed:u}=Ie({...de(a),children:typeof a.children=="function"?!0:a.children},i,R),{isFocused:$,isFocusVisible:c,focusProps:P}=ge(),G=n||i.isReadOnly,{hoverProps:V,isHovered:B}=Ce({...a,isDisabled:G}),I=J({...a,defaultClassName:"react-aria-Radio",values:{isSelected:t,isPressed:u,isHovered:B,isFocused:$,isFocusVisible:c,isDisabled:n,isReadOnly:i.isReadOnly,isInvalid:i.isInvalid,isRequired:i.isRequired}}),j=_(a,{global:!0});return delete j.id,delete j.onClick,D.createElement(Q.label,{...S(j,l,V,I),ref:o,"data-selected":t||void 0,"data-pressed":u||void 0,"data-hovered":B||void 0,"data-focused":$||void 0,"data-focus-visible":c||void 0,"data-disabled":n||void 0,"data-readonly":i.isReadOnly||void 0,"data-invalid":i.isInvalid||void 0,"data-required":i.isRequired||void 0},D.createElement(Ge,{elementType:"span"},D.createElement("input",{...S(f,P),ref:R})),D.createElement(fe.Provider,{value:{isSelected:t}},I.children))}),Z={"bui-RadioGroup":"_bui-RadioGroup_1tanw_20","bui-RadioGroupContent":"_bui-RadioGroupContent_1tanw_26","bui-Radio":"_bui-Radio_1tanw_20"},Te=z()({styles:Z,classNames:{root:"bui-RadioGroup",content:"bui-RadioGroupContent"},propDefs:{children:{},className:{},label:{},secondaryLabel:{},description:{},isRequired:{}}}),_e=z()({styles:Z,classNames:{root:"bui-Radio"},propDefs:{className:{}}}),v=p.forwardRef((e,a)=>{const{ownProps:o,restProps:d}=U(Te,e),{classes:b,label:i,secondaryLabel:R,description:l,isRequired:f,children:t}=o,n=d["aria-label"],u=d["aria-labelledby"];p.useEffect(()=>{!i&&!n&&!u&&console.warn("RadioGroup requires either a visible label, aria-label, or aria-labelledby for accessibility")},[i,n,u]);const $=R||(f?"Required":null);return r.jsxs(Me,{className:b.root,...d,ref:a,children:[r.jsx(Ve,{label:i,secondaryLabel:$,description:l,descriptionSlot:"description"}),r.jsx("div",{className:b.content,children:t}),r.jsx(Be,{})]})});v.displayName="RadioGroup";const s=p.forwardRef((e,a)=>{const{ownProps:o,restProps:d}=U(_e,e);return r.jsx(ke,{className:o.classes.root,...d,ref:a})});s.displayName="Radio";v.__docgenInfo={description:`A group of radio buttons for selecting a single option from a set, with an integrated label, description, and error display.

@public`,methods:[],displayName:"RadioGroup",props:{children:{required:!1,tsType:{name:"ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""},label:{required:!1,tsType:{name:"FieldLabelProps['label']",raw:"FieldLabelProps['label']"},description:""},secondaryLabel:{required:!1,tsType:{name:"FieldLabelProps['secondaryLabel']",raw:"FieldLabelProps['secondaryLabel']"},description:""},description:{required:!1,tsType:{name:"FieldLabelProps['description']",raw:"FieldLabelProps['description']"},description:""},isRequired:{required:!1,tsType:{name:"AriaRadioGroupProps['isRequired']",raw:"AriaRadioGroupProps['isRequired']"},description:""}},composes:["Omit"]};s.__docgenInfo={description:`A single radio button for use within a RadioGroup.

@public`,methods:[],displayName:"Radio",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const q=re.meta({title:"Backstage UI/RadioGroup",component:v}),m=q.story({args:{label:"What is your favorite pokemon?"},render:e=>r.jsxs(v,{...e,children:[r.jsx(s,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(s,{value:"charmander",children:"Charmander"}),r.jsx(s,{value:"squirtle",children:"Squirtle"})]})}),F=q.story({args:{...m.input.args,description:"Choose only one option"},render:e=>r.jsxs(v,{...e,children:[r.jsx(s,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(s,{value:"charmander",children:"Charmander"}),r.jsx(s,{value:"squirtle",children:"Squirtle"})]})}),L=q.story({args:{...m.input.args,orientation:"horizontal"},render:e=>r.jsxs(v,{...e,children:[r.jsx(s,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(s,{value:"charmander",children:"Charmander"}),r.jsx(s,{value:"squirtle",children:"Squirtle"})]})}),N=q.story({args:{...m.input.args,isDisabled:!0},render:e=>r.jsxs(v,{...e,children:[r.jsx(s,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(s,{value:"charmander",children:"Charmander"}),r.jsx(s,{value:"squirtle",children:"Squirtle"})]})}),O=q.story({args:{...m.input.args},render:e=>r.jsxs(v,{...e,children:[r.jsx(s,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(s,{value:"charmander",isDisabled:!0,children:"Charmander"}),r.jsx(s,{value:"squirtle",children:"Squirtle"})]})}),E=q.story({args:{...m.input.args,value:"charmander"},render:e=>r.jsxs(v,{...e,children:[r.jsx(s,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(s,{value:"charmander",isDisabled:!0,children:"Charmander"}),r.jsx(s,{value:"squirtle",children:"Squirtle"})]})}),M=q.story({args:{...m.input.args,name:"pokemon",isInvalid:!0},render:e=>r.jsxs(v,{...e,children:[r.jsx(s,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(s,{value:"charmander",isDisabled:!0,children:"Charmander"}),r.jsx(s,{value:"squirtle",children:"Squirtle"})]})}),k=q.story({args:{...m.input.args,name:"pokemon",defaultValue:"charmander",validationBehavior:"aria",validate:e=>e==="charmander"?"Nice try!":null},render:e=>r.jsxs(v,{...e,children:[r.jsx(s,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(s,{value:"charmander",children:"Charmander"}),r.jsx(s,{value:"squirtle",children:"Squirtle"})]})}),T=q.story({args:{...m.input.args,isReadOnly:!0,defaultValue:"charmander"},render:e=>r.jsxs(v,{...e,children:[r.jsx(s,{value:"bulbasaur",children:"Bulbasaur"}),r.jsx(s,{value:"charmander",children:"Charmander"}),r.jsx(s,{value:"squirtle",children:"Squirtle"})]})});m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'What is your favorite pokemon?'
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
})`,...m.input.parameters?.docs?.source}}};F.input.parameters={...F.input.parameters,docs:{...F.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    description: 'Choose only one option'
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
})`,...F.input.parameters?.docs?.source}}};L.input.parameters={...L.input.parameters,docs:{...L.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    orientation: 'horizontal'
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
})`,...L.input.parameters?.docs?.source}}};N.input.parameters={...N.input.parameters,docs:{...N.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isDisabled: true
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
})`,...N.input.parameters?.docs?.source}}};O.input.parameters={...O.input.parameters,docs:{...O.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...T.input.parameters?.docs?.source}}};const ba=["Default","WithDescription","Horizontal","Disabled","DisabledSingle","DisabledAndSelected","Invalid","Validation","ReadOnly"];export{m as Default,N as Disabled,E as DisabledAndSelected,O as DisabledSingle,L as Horizontal,M as Invalid,T as ReadOnly,k as Validation,F as WithDescription,ba as __namedExportsOrder};
