import{T as P}from"./TablePagination-DxmpgfkD.js";import"./iframe-DgHKkkyr.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DXCmj24P.js";import"./useObjectRef-DMH-GBhM.js";import"./Select-Bv7h2DeD.js";import"./Dialog-DZwDG78Z.js";import"./Button-DQWFpuFN.js";import"./utils-C1o7BLsy.js";import"./Label-DFt2BgeJ.js";import"./Hidden-DNRCN_ic.js";import"./useNumberFormatter-BariNU_U.js";import"./context-BV7aFW6r.js";import"./useFocusable-B6BeVSwN.js";import"./openLink-iVgFRcvl.js";import"./useLabel-RftGCJTm.js";import"./useLabels-BOBl8S-u.js";import"./useButton-BS5Nc_U6.js";import"./usePress-yYF-Bh9Q.js";import"./textSelection-DDomQQoV.js";import"./useFocusRing-qkMzq-Jc.js";import"./RSPContexts-BpYxsdfF.js";import"./OverlayArrow-BanbCYZ7.js";import"./useControlledState-CkXk69k2.js";import"./SelectionManager-R8d54xYK.js";import"./useEvent-HT8lmTYY.js";import"./SelectionIndicator-DxQ47DhH.js";import"./Separator-DkbZUtJM.js";import"./Text-Br96A3dM.js";import"./useLocalizedStringFormatter-BOuFZVr0.js";import"./animation-CtoIKT8l.js";import"./VisuallyHidden-DFvP1mHt.js";import"./FieldError-diMKG1Az.js";import"./Form-xwKRiiJQ.js";import"./ListBox-BoDwWUhY.js";import"./useListState-CXyrRuyQ.js";import"./useField-C-krdq7-.js";import"./useFormReset-CGr6igTR.js";import"./definition-eE0EgXK2.js";import"./Autocomplete-uQP7CcgL.js";import"./Input-Bdlb1wRc.js";import"./SearchField-C-2zpTuF.js";import"./useFilter-yIjTxLrL.js";import"./FieldLabel-CWdGKtm6.js";import"./FieldError-CnNJfR92.js";import"./Text-DfksO4NV.js";import"./ButtonIcon-Bm8Vpkop.js";const p=()=>{},pe={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},a={args:{...e.args}},o={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...e.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  }
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 90,
    hasNextPage: false,
    hasPreviousPage: true
  }
}`,...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const ge=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{s as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,a as FirstPage,o as LastPage,r as MiddlePage,t as WithoutPageSizeOptions,ge as __namedExportsOrder,pe as default};
