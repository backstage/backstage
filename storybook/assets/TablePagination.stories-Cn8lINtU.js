import{T as P}from"./TablePagination-Bx-7xu6P.js";import"./iframe-X5mwL4tp.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-B4ikIkxr.js";import"./index-BaDW95zO.js";import"./Select-DBIOHQ7N.js";import"./Button-Mr7_7LVv.js";import"./utils-DbglA0qc.js";import"./Label-Du0ObhKE.js";import"./Hidden-DXcGagMc.js";import"./useFocusRing-C-qV4ltP.js";import"./openLink-iaf6h5Vg.js";import"./useLabel-DttWp7u_.js";import"./useLabels-CyId-J7Z.js";import"./number-BgaIE-sV.js";import"./I18nProvider-Cp8YwWQe.js";import"./useButton-b3MTXzJF.js";import"./usePress-C87_1f3H.js";import"./textSelection-DtJZPEXI.js";import"./useHover-iQz_in6H.js";import"./FieldError-D3Li39rU.js";import"./Text-D1k2Dp8f.js";import"./useFormValidation-hr5mEY2s.js";import"./ListBox-Dw_6YJ7x.js";import"./useCollection-D6kXv1i_.js";import"./keyboard-SH1FHugW.js";import"./FocusScope-ChrxsfV7.js";import"./useEvent-B9gIp-0I.js";import"./useControlledState-VUJiIP94.js";import"./getItemCount-CCMQjwsk.js";import"./Autocomplete-DZgLERJG.js";import"./useLocalizedStringFormatter-DJopSl5i.js";import"./useListState-Dtv5tBCM.js";import"./Dialog-hwZzxVwX.js";import"./Heading-BUx8lHFH.js";import"./useOverlayTriggerState-DadPaReJ.js";import"./VisuallyHidden-D2nFrwYc.js";import"./animation-DwrFgyaB.js";import"./useField-O4p38GKT.js";import"./useFormReset-DGDQjoCT.js";import"./Input-DJuIrIG0.js";import"./SearchField-CFnfufPI.js";import"./useTextField-DinD4WeQ.js";import"./useFilter-CVSTsY3u.js";import"./useCollectionAdapter-BJ1i6d1i.js";import"./Avatar-CJLX9-r5.js";import"./Skeleton-DeHPy76Y.js";import"./FieldLabel-5pjEprhb.js";import"./FieldError-CIOznkIw.js";import"./Popover-DmShJhvs.js";import"./Text-DuxikEFP.js";import"./ButtonIcon-B5N6B-GF.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
