import{T as P}from"./TablePagination-DcaUkaWx.js";import"./iframe-J3scbCK7.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-CYiyNzgW.js";import"./index-dtgEZu1w.js";import"./Select-C5gdJT37.js";import"./Button-BRjZSFG-.js";import"./utils-CXCc_oGJ.js";import"./Label-CZdg3p-k.js";import"./Hidden-RMOzfft_.js";import"./useFocusRing-lNGJkQ5U.js";import"./openLink-BYbBBzFI.js";import"./useLabel-CdAWakw3.js";import"./useLabels-tuukLlho.js";import"./number-B1XZmGQH.js";import"./I18nProvider-BmKrAj2D.js";import"./useButton-Dz9TOBMM.js";import"./usePress-oQ0Te5kE.js";import"./textSelection-QyuURRcd.js";import"./useHover-CwRlhx06.js";import"./FieldError-B0c2RKK0.js";import"./Text-DH7_sXsF.js";import"./useFormValidation-zrBOIZdf.js";import"./ListBox-UrDHST0o.js";import"./useCollection-CYZW3AoK.js";import"./keyboard-D2Y4eCz5.js";import"./FocusScope-CZ1AJ7eH.js";import"./useEvent-B3GM1Fij.js";import"./useControlledState-DShAbZI7.js";import"./getItemCount-P9T_ZwX3.js";import"./Autocomplete--nAxv__n.js";import"./useLocalizedStringFormatter-Xrd7W-Po.js";import"./useListState-Dm4dYv4O.js";import"./Dialog-CRe_krMo.js";import"./Heading-BmSTr2hW.js";import"./useOverlayTriggerState-Djk9kxal.js";import"./VisuallyHidden-DDRaOimJ.js";import"./animation-CIWnDDLd.js";import"./useField-CqTLy_Vm.js";import"./useFormReset-DtBlZ5rd.js";import"./Input-DPORZ8J4.js";import"./SearchField-BMKtrOTg.js";import"./useTextField-B3ICUpsH.js";import"./useFilter-Ba4xXVuI.js";import"./useCollectionAdapter-B_cPqsGE.js";import"./Avatar-Bf0YK8MR.js";import"./Skeleton-DwVxCZws.js";import"./FieldLabel-CK7QOhBn.js";import"./FieldError-1T67z3vL.js";import"./Popover-CIVREDuw.js";import"./Text-CB1952Wg.js";import"./ButtonIcon-DjGciNd5.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
