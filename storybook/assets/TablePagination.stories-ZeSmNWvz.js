import{T as P}from"./TablePagination-BXgEEgu1.js";import"./iframe-5xJVwFMl.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-COysk4Ng.js";import"./index-W19nKV8Q.js";import"./Select-UnCZFDE3.js";import"./Button-B_04NqPW.js";import"./utils-g1c0Kr3k.js";import"./Label-xTQOkMYl.js";import"./Hidden-BbW38WTn.js";import"./useFocusRing-CL8Atm-X.js";import"./openLink-CN5IUfel.js";import"./useLabel-DMuCEq2v.js";import"./useLabels-ClOBW_ex.js";import"./number-Dp3Tfxh5.js";import"./I18nProvider-CF59bDP3.js";import"./useButton-aPTu4J1u.js";import"./usePress-Cd47Wv9a.js";import"./textSelection-TIBZk0b6.js";import"./getMetaValue-CQBj6zNl.js";import"./useHover-0u_T0iEc.js";import"./FieldError-Yfpcergq.js";import"./Text-MPpkcO3C.js";import"./Form-fpgMP67S.js";import"./useFormValidation-Bionm8Qj.js";import"./ListBox-Tx0vjixX.js";import"./useCollection-Bjf0fzB1.js";import"./keyboard-Do48IGOY.js";import"./FocusScope-B-l0JHVh.js";import"./useEvent-BJYs4tdM.js";import"./useControlledState-DeUghDUN.js";import"./useLoadMoreSentinel-CqHS78wS.js";import"./Autocomplete-BSWzw426.js";import"./useLocalizedStringFormatter-DPT4WBHg.js";import"./SelectionIndicator-DhB9py-C.js";import"./useListState-D9qoIJXi.js";import"./Dialog-CbxrPVlf.js";import"./Heading-CHJ5u2XV.js";import"./useOverlayTriggerState-D-pWsPKw.js";import"./VisuallyHidden-BySVkOjk.js";import"./animation-DqGFbVcO.js";import"./useField-BdW6ZByv.js";import"./useFormReset-DWokUbV3.js";import"./Input-DHEuej01.js";import"./SearchField-1fiyVs64.js";import"./useTextField-BtKb3rjA.js";import"./useFilter-K8A-0h2d.js";import"./useCollectionAdapter-WWppBTXg.js";import"./Avatar-K6Aa3uA1.js";import"./Skeleton-oj73vk-s.js";import"./FieldLabel-QvnwgMdh.js";import"./FieldError-pvGoUCZa.js";import"./Popover-DHcpP0ns.js";import"./Text-DhSvT2Uk.js";import"./ButtonIcon-Bmmodoee.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
