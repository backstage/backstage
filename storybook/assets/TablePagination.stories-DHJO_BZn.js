import{T as P}from"./TablePagination-vkXugM9f.js";import"./iframe-wUGVZK80.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-Cer6noLc.js";import"./index-CxFlMd0n.js";import"./Select-X3XX9rZF.js";import"./Button-d6OZAENs.js";import"./utils-mEgVZwEH.js";import"./Label-CZ0yGWTb.js";import"./Hidden-yseb-6tt.js";import"./useFocusRing-BC7vVkX4.js";import"./openLink-D6ixiiSG.js";import"./useLabel-r6Cj49-v.js";import"./useLabels-CANwnRLq.js";import"./number-vyQ0g_EM.js";import"./I18nProvider-Ci8FoB4z.js";import"./useButton-DkR_L0-r.js";import"./usePress-0P_K_iFV.js";import"./textSelection-C7djrXyy.js";import"./useHover-DRcNaDP5.js";import"./FieldError-DakbevJf.js";import"./Text-nk-Fwv2h.js";import"./useFormValidation-DqwUvKPf.js";import"./ListBox-DWyTEJqb.js";import"./useCollection-DMwIrrK2.js";import"./keyboard-DQLW8ZAU.js";import"./FocusScope-BtCRdK36.js";import"./useEvent-Co7ShWYJ.js";import"./useControlledState-BP7q2gJ8.js";import"./getItemCount-DoA8uYAv.js";import"./Autocomplete-PQK_iJWN.js";import"./useLocalizedStringFormatter-B0GnQ-25.js";import"./useListState-CuT9TiQ1.js";import"./Dialog-DLYL351a.js";import"./Heading-B1KZpqXO.js";import"./useOverlayTriggerState-BMbSord3.js";import"./VisuallyHidden-Br3tk3-5.js";import"./animation-CeCl3Lpx.js";import"./useField-CgH-KdhV.js";import"./useFormReset-CMPleS-P.js";import"./Input-NXPn2g8K.js";import"./SearchField-BJK972h3.js";import"./useTextField-pS2dYT4L.js";import"./useFilter-Dc7YICpk.js";import"./useCollectionAdapter-I4LAC0v1.js";import"./Avatar-BfV-CbXg.js";import"./Skeleton-DNUq2prG.js";import"./FieldLabel-DjA1ud8L.js";import"./FieldError-DElk7ZMA.js";import"./Popover-DCugnOuv.js";import"./Text-C5GZ5c8P.js";import"./ButtonIcon-44wQ_emu.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
