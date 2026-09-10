import{T as P}from"./TablePagination-BcDBSs51.js";import"./iframe-B771vieD.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-B_q1TfVk.js";import"./index-DGRdaIIA.js";import"./Select-BLB7Ji8J.js";import"./Button-B8TxKSC7.js";import"./utils-piiChbE4.js";import"./Label-CJhGoTGL.js";import"./Hidden-DiCVpsT2.js";import"./useFocusRing-C2ykLkBs.js";import"./openLink-AzCo47yl.js";import"./useLabel-CXc7CDh8.js";import"./useLabels-2XgX8oa0.js";import"./number-b5ov0AaU.js";import"./I18nProvider-B3qRoePR.js";import"./useButton-CAudcQRr.js";import"./usePress-CNqwnYXg.js";import"./textSelection-Dajp4U4D.js";import"./useHover-B_jF8Yhh.js";import"./FieldError-3yynpqf_.js";import"./Text-C7Zn0WpC.js";import"./useFormValidation-9u5BPFfE.js";import"./ListBox-CfU-TpSf.js";import"./useCollection-3GzdWbYl.js";import"./keyboard-SkeTI-tm.js";import"./FocusScope-BjGHNLEJ.js";import"./useEvent-C9lgzcbu.js";import"./useControlledState-xxmVxo9Z.js";import"./getItemCount-Bmtj2mYU.js";import"./Autocomplete-C4yaEcL8.js";import"./useLocalizedStringFormatter-N3j0wPvB.js";import"./useListState-DEdI56Mv.js";import"./Dialog-D7n49PW9.js";import"./Heading-COYTGuuZ.js";import"./useOverlayTriggerState-e3hiHQi-.js";import"./VisuallyHidden-C0TN364h.js";import"./animation-CfBUvVtR.js";import"./useField-BIaMG0YS.js";import"./useFormReset-BE1g8HWI.js";import"./Input-C9mt94Bx.js";import"./SearchField-DZNM_RUF.js";import"./useTextField-ta8DG0m3.js";import"./useFilter-4Dlsunnw.js";import"./useCollectionAdapter-BClVUSes.js";import"./Avatar-CzWFYucm.js";import"./Skeleton-DmRKwkm6.js";import"./FieldLabel-C799dubn.js";import"./FieldError-ytgu827_.js";import"./Popover-BdRw6hsa.js";import"./Text-B84F5tk6.js";import"./ButtonIcon-DMq-EbIm.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const Pe=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{s as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,o as FirstPage,a as LastPage,r as MiddlePage,t as WithoutPageSizeOptions,Pe as __namedExportsOrder,le as default};
