import{T as P}from"./TablePagination-CA-1JhtB.js";import"./iframe-CR1Jw9dV.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-CxAJnmky.js";import"./index-CHKdAyZ9.js";import"./Select-DhAsAU1s.js";import"./BUIRoutingProvider-D2NI50xw.js";import"./useFocusRing-CCR0Dk_B.js";import"./Button-DzhTBfgP.js";import"./utils-f1XPU8sj.js";import"./Label-C37_b03j.js";import"./Hidden-B3uAAl_R.js";import"./useLabel-B8RNTxDr.js";import"./useLabels-C65kEDvg.js";import"./number-CXcznxJS.js";import"./I18nProvider-CXlyEy0i.js";import"./useButton-HAI6nP2s.js";import"./usePress-BO_FqSCY.js";import"./textSelection-DRBuEoQO.js";import"./getMetaValue-QyE7lEVK.js";import"./useHover-COtbARlD.js";import"./FieldError-xrm2enzG.js";import"./Text-BX3OTawI.js";import"./Form-CirHk10M.js";import"./useFormValidation-rdS9Nj4h.js";import"./ListBox-Ch73kLxF.js";import"./useCollection-B_pZRIWT.js";import"./keyboard-DwLZW9jg.js";import"./FocusScope-BEubVjvS.js";import"./useEvent-Dm-E9hNt.js";import"./useControlledState-BQLBMnzZ.js";import"./useLoadMoreSentinel-CpKLnC9F.js";import"./Autocomplete-B2_gIgbH.js";import"./useLocalizedStringFormatter-C4g2OxQ5.js";import"./SelectionIndicator-CwTfXNxW.js";import"./useListState-ZYihbrKT.js";import"./Dialog-BqIzS5Wf.js";import"./Heading-CQY9eX9y.js";import"./useOverlayTriggerState-BrayxibY.js";import"./VisuallyHidden-DyHRdEeF.js";import"./animation-reWawdWv.js";import"./useField-Cc85Nw2S.js";import"./useFormReset-DTZFkvsG.js";import"./Input-CPFU7dv3.js";import"./SearchField-BOktDJgN.js";import"./useTextField-CzwueCey.js";import"./useFilter-Cbln8Yhz.js";import"./useCollectionAdapter-CMUPkiRF.js";import"./Avatar-DRk-eqjC.js";import"./Skeleton--5vuUttW.js";import"./FieldLabel-C1xEgbnV.js";import"./FieldError-BF0TTJEo.js";import"./Popover-Bakhe6Uu.js";import"./Text-CKKX0sl4.js";import"./ButtonIcon-B6UbfbyX.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const he=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{s as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,o as FirstPage,a as LastPage,r as MiddlePage,t as WithoutPageSizeOptions,he as __namedExportsOrder,de as default};
