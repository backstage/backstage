import{T as P}from"./TablePagination-CmpVgKWe.js";import"./iframe-Bfeun6FV.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-DpvjfcTN.js";import"./index-CVNQhIDx.js";import"./Select-DI3c3dFR.js";import"./Button-CXBJEZu8.js";import"./utils-C1fACjU5.js";import"./Label-CMwfur8h.js";import"./Hidden-sFV-2aQN.js";import"./useFocusRing-D2D9w2h7.js";import"./openLink-Z9FeXa0N.js";import"./useLabel-fE5WpueX.js";import"./useLabels-ClA9bczX.js";import"./number-3AeMSo45.js";import"./I18nProvider-TylybwwN.js";import"./useButton-35EaW1qC.js";import"./usePress-TbacPce5.js";import"./textSelection-DZyb17vv.js";import"./useHover-Bl99Bvws.js";import"./FieldError-BWjgqGMr.js";import"./Text-DOL3ix9A.js";import"./useFormValidation-BCBDK8Qf.js";import"./ListBox-D-ejC2JJ.js";import"./useCollection-DeX7otQ8.js";import"./keyboard-BTOl7xVT.js";import"./FocusScope-Bv6PArKX.js";import"./useEvent-vC-ysoRO.js";import"./useControlledState-CC8JDBnw.js";import"./getItemCount-C_eYKaFf.js";import"./Autocomplete-DZ5iwN9X.js";import"./useLocalizedStringFormatter-D_4gFDnf.js";import"./useListState-EmLhgg1p.js";import"./Dialog-CRthzS2b.js";import"./Heading-BcnG0VjG.js";import"./useOverlayTriggerState-DF5r881j.js";import"./VisuallyHidden-CtLKqaVY.js";import"./animation-DPrX5Bmr.js";import"./useField-BxvGjrCe.js";import"./useFormReset-DCGdCl6y.js";import"./Input-D48E8LcP.js";import"./SearchField-CBhic2oo.js";import"./useTextField-h-cI21RN.js";import"./useFilter-MUPmUk7G.js";import"./useCollectionAdapter-Cjt_Ux1f.js";import"./Avatar-BUycbrD_.js";import"./Skeleton-BTMCoh3J.js";import"./FieldLabel-DhcYpfqa.js";import"./FieldError-DsJ-fXjs.js";import"./Popover-B5AUHP5E.js";import"./Text-Cgoj6p6V.js";import"./ButtonIcon-Dk4ShQ2Z.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
