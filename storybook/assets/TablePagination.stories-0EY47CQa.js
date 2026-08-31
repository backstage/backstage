import{T as P}from"./TablePagination-CU7GzLyg.js";import"./iframe-D3gHomOk.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-hXxbhaat.js";import"./index-CIObmbyT.js";import"./Select-n4LewO0S.js";import"./Button-Cu1Zpd0O.js";import"./utils--jiZfpYa.js";import"./Label-CAWIGhje.js";import"./Hidden-CXwBcFFN.js";import"./useFocusRing-DHt_dYoo.js";import"./openLink-BpYvnjEr.js";import"./useLabel-W6Ub3U1-.js";import"./useLabels-DMTWiEER.js";import"./number-L24Dz_3k.js";import"./I18nProvider-Bras-Ck8.js";import"./useButton-BQFf-KYE.js";import"./usePress-CVpxTLfU.js";import"./textSelection-NP_j1vUN.js";import"./useHover-ZdERZDwl.js";import"./FieldError-DZcZSqlY.js";import"./Text-CQOWjHmq.js";import"./useFormValidation-dBRW7xC2.js";import"./ListBox-C-HnKv6b.js";import"./useCollection-CcQg7U7w.js";import"./keyboard-XkEo6qi_.js";import"./FocusScope-l3B1Tt6B.js";import"./useEvent-9StB23wA.js";import"./useControlledState-fmlyVL5h.js";import"./getItemCount-JzJ4DlKD.js";import"./Autocomplete-kr6thEjl.js";import"./useLocalizedStringFormatter-zPjMhKe2.js";import"./useListState-CijF9aw-.js";import"./Dialog-BmDk8gAt.js";import"./Heading-BbqFKY1r.js";import"./useOverlayTriggerState-BAAbOSKk.js";import"./VisuallyHidden-CliApQIk.js";import"./animation-BtY6VQj9.js";import"./useField-B6xw7g85.js";import"./useFormReset-Dkm8T-fh.js";import"./Input-DSlTO14n.js";import"./SearchField-BjeHTVk3.js";import"./useTextField-DimOsl7G.js";import"./useFilter-DogpFwYU.js";import"./useCollectionAdapter-C8vfoU5-.js";import"./Avatar-Btm0qspk.js";import"./Skeleton-C8zYMq_3.js";import"./FieldLabel-BMXSuxrW.js";import"./FieldError-DQhdOycD.js";import"./Popover-CyToX2L1.js";import"./Text-nVMuxvjC.js";import"./ButtonIcon-o_P6yo4U.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
