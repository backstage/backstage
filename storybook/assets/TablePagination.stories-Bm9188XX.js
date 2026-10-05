import{T as P}from"./TablePagination-MJvZwV9z.js";import"./iframe-CbQECOPA.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-rAZvTeo9.js";import"./index-CVJ_DY1z.js";import"./Select-NfF1r2zt.js";import"./Button-CqUujd7S.js";import"./utils-BjKqyDUC.js";import"./Label-CmorgM_W.js";import"./Hidden-Cie_Gmgv.js";import"./useFocusRing-BprGfwbh.js";import"./openLink-CkgyiaKP.js";import"./useLabel-BlUgJ3a0.js";import"./useLabels-Hmk_0Efx.js";import"./number-CbNxdcRk.js";import"./I18nProvider-X_rloAM9.js";import"./useButton-hc7LOMzh.js";import"./usePress-C80y_bid.js";import"./textSelection-CTwx7Hd8.js";import"./useHover-C0zeuS3S.js";import"./FieldError-CYK7f2yb.js";import"./Text-DTo7MTvL.js";import"./useFormValidation-CKGiJz9e.js";import"./ListBox-DyOFqIrC.js";import"./useCollection-DIi-vDTy.js";import"./keyboard-BiB554EB.js";import"./FocusScope-CfCaPDEx.js";import"./useEvent-DYgfpRDF.js";import"./useControlledState-BYBhhx6m.js";import"./getItemCount-B_r3Vxwo.js";import"./Autocomplete-BNai4oWa.js";import"./useLocalizedStringFormatter-B4KkAVMn.js";import"./useListState-NojfAC-Q.js";import"./Dialog-B9J-z4RW.js";import"./Heading-t8vg85oi.js";import"./useOverlayTriggerState-CU1gdxD5.js";import"./VisuallyHidden-N7kQo01U.js";import"./animation-LCLQa1wT.js";import"./useField-Bwd8Jmt6.js";import"./useFormReset-BJvTatsh.js";import"./Input-CjJ1M9tR.js";import"./SearchField-CIp1uFk3.js";import"./useTextField-DyaWxWWJ.js";import"./useFilter-B9gIhNbK.js";import"./useCollectionAdapter-XcwRDV_a.js";import"./Avatar-D8o9qZWl.js";import"./Skeleton-BwO9jW-r.js";import"./FieldLabel-dShiW8C9.js";import"./FieldError-R52eNSBw.js";import"./Popover-DrA163h3.js";import"./Text-Y4w9it8L.js";import"./ButtonIcon-CTFS9Glx.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
