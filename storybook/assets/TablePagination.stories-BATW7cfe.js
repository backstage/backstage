import{T as P}from"./TablePagination-BXLfvOZP.js";import"./iframe-CY7lbe83.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-CgmSUdjG.js";import"./index-BOd6gQGa.js";import"./Select-DMvqEOcb.js";import"./Dialog-gGa65i6P.js";import"./Button-DkPUEGj-.js";import"./utils-VYcEwieo.js";import"./Label-c4yIVKxR.js";import"./Hidden-tSGVjCBQ.js";import"./useFocusRing--SoVj0Ul.js";import"./openLink-BO2-TBpk.js";import"./useLabel-D0Y-IO0Y.js";import"./useLabels-DZeRL03G.js";import"./number-DaFt9bAO.js";import"./I18nProvider-BwtzYg6c.js";import"./useButton-B-JKHCjV.js";import"./usePress-Bv61y3b6.js";import"./textSelection-CyJ29i24.js";import"./useHover-Bn9Qukxg.js";import"./Heading-CqENNOCa.js";import"./useOverlayTriggerState-Dk1jpnEh.js";import"./useControlledState-D-EZ3Xb3.js";import"./useCollection-Cj6w_hkh.js";import"./keyboard-DOb-I_Jw.js";import"./FocusScope-Ac2MUMEQ.js";import"./useEvent-CGzLQHsh.js";import"./Autocomplete-Co0fhdty.js";import"./useLocalizedStringFormatter-Dz6q2bPr.js";import"./getItemCount-Cbtxh9os.js";import"./Text-vRRZ87_O.js";import"./VisuallyHidden-U0CvwNzU.js";import"./animation-BvbKFea0.js";import"./FieldError-DjdiVOe2.js";import"./useFormValidation-BVSvJSo1.js";import"./ListBox-ZVqNRHXG.js";import"./useListState-C8yv5r6m.js";import"./useField-6bQfw_6T.js";import"./useFormReset-C_7EFAQX.js";import"./definition-aotqgsUn.js";import"./Input-Bg7y8yar.js";import"./SearchField-DyDoTnFi.js";import"./useTextField-BSAijlMc.js";import"./useFilter-ufW6iqCi.js";import"./FieldLabel-B25J2MyF.js";import"./FieldError-Vjr3-H0Q.js";import"./Text-t1BpvbUJ.js";import"./ButtonIcon-yeSQjp-e.js";const p=()=>{},me={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    offset: 0,
    pageSize: 10,
    totalCount: 100,
    hasNextPage: true,
    hasPreviousPage: false,
    onNextPage: noop,
    onPreviousPage: noop,
    onPageSizeChange: noop,
    showPageSizeOptions: true
  }
}`,...e.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  }
}`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 90,
    hasNextPage: false,
    hasPreviousPage: true
  }
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 40,
    hasPreviousPage: true
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    showPageSizeOptions: false
  }
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: undefined
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 20,
    hasPreviousPage: true,
    getLabel: ({
      offset,
      pageSize,
      totalCount
    }) => {
      const page = Math.floor((offset ?? 0) / pageSize) + 1;
      const totalPages = Math.ceil((totalCount ?? 0) / pageSize);
      return \`Page \${page} of \${totalPages}\`;
    }
  }
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    totalCount: 0,
    hasNextPage: false
  }
}`,...i.parameters?.docs?.source}}};const ce=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{s as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,o as FirstPage,a as LastPage,r as MiddlePage,t as WithoutPageSizeOptions,ce as __namedExportsOrder,me as default};
