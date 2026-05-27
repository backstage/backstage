import{T as P}from"./TablePagination-CMQRj37S.js";import"./iframe-BNTyYmtG.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-CDa-or3Y.js";import"./index-C8rh_m7A.js";import"./Select-Dqq84KNR.js";import"./Dialog-Cp_3F1ML.js";import"./Button-PkTTn99h.js";import"./utils-CyuBiUD4.js";import"./Label-CNmmxM3d.js";import"./Hidden-BtP4guDR.js";import"./useFocusRing-BWmLw9rR.js";import"./openLink-Cp11RzW3.js";import"./useLabel-CLTwzcls.js";import"./useLabels-CBB6X3-B.js";import"./number-DwFayFjv.js";import"./I18nProvider-B9FdOvIU.js";import"./useButton-D77sY4l3.js";import"./usePress-BRcnfhhc.js";import"./textSelection-BfupiB-d.js";import"./useHover-X6HJJf1O.js";import"./Heading-CSSjk1hD.js";import"./useOverlayTriggerState-_tQLg6mT.js";import"./useControlledState-rMbSRUJj.js";import"./useCollection-B_zxFZTn.js";import"./keyboard-CNV-Sh3o.js";import"./FocusScope-CsJpViPX.js";import"./useEvent-CVq293a6.js";import"./Autocomplete-1nPdkF4L.js";import"./useLocalizedStringFormatter-C0tJhbl8.js";import"./getItemCount-7U9nLrmE.js";import"./Text-C8xpNyG_.js";import"./VisuallyHidden-ZzmSt03W.js";import"./animation-Qvf_kPpd.js";import"./FieldError--gXbzDCi.js";import"./useFormValidation-fvekUHNM.js";import"./ListBox-C-Xl6obL.js";import"./useListState-_VCki6jn.js";import"./useField-Ba3ZZIqM.js";import"./useFormReset-CiTePYjF.js";import"./definition-BPvPp9uA.js";import"./Input-CD5Y9H5F.js";import"./SearchField-DhJWOuFL.js";import"./useTextField-BjP8T_w0.js";import"./useFilter-BlBdcDbN.js";import"./FieldLabel-455qDG_6.js";import"./FieldError-DgX_rIp6.js";import"./Text-Cxly0LmW.js";import"./ButtonIcon-b4J8QW2o.js";const p=()=>{},me={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
