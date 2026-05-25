import{T as P}from"./TablePagination-C4snHs8p.js";import"./iframe-C23uhf86.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-CJDmkZpR.js";import"./index-DuaXyiyY.js";import"./Select-7GxS_835.js";import"./Dialog-9gAcn4Uu.js";import"./Button-BCvUP0ah.js";import"./utils-BTFvkEKN.js";import"./Label-BYGIUoFL.js";import"./Hidden-CRM2dL4T.js";import"./useFocusRing-DjjD4IM-.js";import"./openLink-DxqMpht5.js";import"./useLabel-Dyy8lcsl.js";import"./useLabels-BoutWtqQ.js";import"./number-Cx5ocEoD.js";import"./I18nProvider-a-g2zHGf.js";import"./useButton-_nGZJOtV.js";import"./usePress-BFbtvNJi.js";import"./textSelection-DG7Jw-Nl.js";import"./useHover-CNSmrNNW.js";import"./Heading-CJ9ZDpcx.js";import"./useOverlayTriggerState-BXv2y5E-.js";import"./useControlledState-DD6mA6a5.js";import"./useCollection-D5kaWD_8.js";import"./keyboard-BpVW5L3b.js";import"./FocusScope-07XFy-96.js";import"./useEvent-BmJhPE79.js";import"./Autocomplete-DFXl_Sx_.js";import"./useLocalizedStringFormatter-C_6ZgqaR.js";import"./getItemCount-ql2Esy6K.js";import"./Text-Yi6KgqO1.js";import"./VisuallyHidden-BIZ6KN8J.js";import"./animation-BF1NbYlT.js";import"./FieldError-iRPmrSuI.js";import"./useFormValidation-CYmyaPkp.js";import"./ListBox-BKubMTPQ.js";import"./useListState-CFAhTKHZ.js";import"./useField-8d5ZEGxO.js";import"./useFormReset-0pGRCi9e.js";import"./definition-D94MHbWD.js";import"./Input-Do0_Yt4D.js";import"./SearchField-WZjPTIyv.js";import"./useTextField-DnmWLnRM.js";import"./useFilter-C_qALbIi.js";import"./FieldLabel-5KeaBn_3.js";import"./FieldError-Caq4zewp.js";import"./Text-BGpUnZ7J.js";import"./ButtonIcon-0syQUwRf.js";const p=()=>{},me={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
