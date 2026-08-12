import{T as P}from"./TablePagination-BSrHcVTT.js";import"./iframe-D690ZVKa.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-BPqBfMfb.js";import"./index-Bm8BO3VD.js";import"./Select-uFSbHGDp.js";import"./Button-DsupNxvN.js";import"./utils-D1ifMOcR.js";import"./Label-CHMEqKLB.js";import"./Hidden--Qykx-Ic.js";import"./useFocusRing-CBblcblV.js";import"./openLink-DlPHZOe9.js";import"./useLabel-Bv75J3A8.js";import"./useLabels-D2HAWa9S.js";import"./number-CGXALLEc.js";import"./I18nProvider-D9TsogMC.js";import"./useButton-D0OzxRTD.js";import"./usePress-BTPot_r7.js";import"./textSelection-30hfHS5F.js";import"./useHover-Da9hkWGW.js";import"./FieldError-Bg2OCVZ8.js";import"./Text-DseDNxUL.js";import"./useFormValidation-qsZG3W-8.js";import"./ListBox-DOVlmSgM.js";import"./useCollection-D-VyboA4.js";import"./keyboard-D72E8r4x.js";import"./FocusScope-BcDRs29o.js";import"./useEvent-DY20iqcf.js";import"./useControlledState-S0N1AjAP.js";import"./getItemCount-Bjv4j4sv.js";import"./Autocomplete-BRVeIDCi.js";import"./useLocalizedStringFormatter-ByHr0kaQ.js";import"./useListState-C5Bz0e36.js";import"./Dialog-DVx8D5E7.js";import"./Heading-CqcDwANL.js";import"./useOverlayTriggerState-CBv8lv31.js";import"./VisuallyHidden-DxRh6ZTQ.js";import"./animation-C9FyvRVk.js";import"./useField-Ibn97tBU.js";import"./useFormReset-kBO1a2OJ.js";import"./Input-BcIjPPf8.js";import"./SearchField-eliH_CKZ.js";import"./useTextField-CbO3TsY_.js";import"./useFilter-CFFLiM5t.js";import"./useCollectionAdapter-ZnUnymCO.js";import"./Avatar-C2TvyaoI.js";import"./Skeleton-CZwQdK4S.js";import"./FieldLabel-ctB3568e.js";import"./FieldError-s74MDeYJ.js";import"./Popover-DR-VjMIs.js";import"./Text-BbMH-w14.js";import"./ButtonIcon-D1vSayV3.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
