import{T as P}from"./TablePagination-BTfsVQbO.js";import"./iframe-t9H7a1GP.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-D-LfZK3P.js";import"./index-B2o8Nitq.js";import"./Select-DPnPDEad.js";import"./Dialog-DNGu89DR.js";import"./Button-BO1t6O6T.js";import"./utils-B_HK0fZy.js";import"./Label-BJGo-8TB.js";import"./Hidden-CpRkSTHD.js";import"./useFocusRing-DNWvY8RS.js";import"./openLink-B2Zr3UoO.js";import"./useLabel-DKCkml_f.js";import"./useLabels-C5_jB9N4.js";import"./number-DYBOfH25.js";import"./I18nProvider-IedlwoY8.js";import"./useButton-rKZR3HiN.js";import"./usePress-C_lRFzPq.js";import"./textSelection-Dq7X0EAE.js";import"./useHover-qr3gz19p.js";import"./Heading-DhXyn_3i.js";import"./useOverlayTriggerState-NopRWek4.js";import"./useControlledState-DpMbG7KC.js";import"./useCollection-CYvCL1ii.js";import"./keyboard-CM4wuuwl.js";import"./FocusScope-B32KV7sa.js";import"./useEvent-Ch2RdOnN.js";import"./Autocomplete-BaTK0OPO.js";import"./useLocalizedStringFormatter-DhiAY8I9.js";import"./getItemCount-DtWFxvPb.js";import"./Text-BFIdZobh.js";import"./VisuallyHidden-Ber9pqXl.js";import"./animation-Cm5xaXnR.js";import"./FieldError-CTPduq9I.js";import"./useFormValidation-C7fFAsQQ.js";import"./ListBox-DWfVfPEa.js";import"./useListState-DZw3CQnM.js";import"./useField-BjWwUXpF.js";import"./useFormReset-AFJ5yClQ.js";import"./definition-BXG790Cl.js";import"./Input-ChvyHnwH.js";import"./SearchField-Dz0UyMzp.js";import"./useTextField-C-ULO0ld.js";import"./useFilter-CECzPmg3.js";import"./FieldLabel-Bwlgvu3A.js";import"./FieldError-DtkF0abN.js";import"./Text-nAVLbsLA.js";import"./ButtonIcon-jExiQj3w.js";const p=()=>{},me={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
