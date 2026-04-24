import{T as P}from"./TablePagination-Db9NLAZE.js";import"./iframe-Co8mkF6n.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-CKxXIUuU.js";import"./index-D05_zZfE.js";import"./Select-DJAvx8xm.js";import"./Dialog-Csg5q1nN.js";import"./Button-BsohaBLi.js";import"./utils-DFVjs8u4.js";import"./Label-DFJY0nKj.js";import"./Hidden-BB_jtIZQ.js";import"./useGlobalListeners-xgPoTTUI.js";import"./openLink-Dd3JFEWo.js";import"./useLabel-CAnYuo-X.js";import"./useLabels-C-5jw__4.js";import"./number-BUCabbiB.js";import"./I18nProvider-CgUstpXg.js";import"./useButton-DEVeMHVy.js";import"./usePress-BPCoUohR.js";import"./textSelection-CGMa-xp_.js";import"./useHover-Dpk2q5V4.js";import"./Heading-CMCpP_gl.js";import"./useOverlayTriggerState-l0gs-tZL.js";import"./useControlledState-CC0_950v.js";import"./useCollection-Bv6NTQGn.js";import"./keyboard-DMpPwGr0.js";import"./FocusScope-B_BOsWzx.js";import"./useEvent-ChskwOT9.js";import"./Autocomplete-2wxhl1YR.js";import"./useLocalizedStringFormatter-CMC27ohZ.js";import"./getItemCount-a_Apa3M0.js";import"./Text-CctO4my8.js";import"./VisuallyHidden-BB1faH2D.js";import"./animation-Cpm4eN3T.js";import"./FieldError-KgOzCOLr.js";import"./useFormValidation-B_d_Ploj.js";import"./ListBox-BTsSe9mi.js";import"./useListState-Dr7pMU3r.js";import"./useField-DaoJWrKY.js";import"./useFormReset-BwkCJt7U.js";import"./definition-Bp3ycd-O.js";import"./Input-BXEMGmmF.js";import"./SearchField-Cfd-NsGU.js";import"./useTextField-DeepGYXq.js";import"./useFilter-BUtJliKP.js";import"./FieldLabel-CoVFaTp1.js";import"./FieldError-ChVEHsLo.js";import"./Text-BqI6Kzhe.js";import"./ButtonIcon-gKiuuoPD.js";const p=()=>{},me={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
