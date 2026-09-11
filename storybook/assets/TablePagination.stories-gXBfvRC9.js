import{T as P}from"./TablePagination-CvN-BYpd.js";import"./iframe-DgMUslzK.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-XeGD6VQX.js";import"./index-CQmiOcmz.js";import"./Select-Bi8jhfAj.js";import"./Button-Ce1GzKNk.js";import"./utils-DhxbSGHl.js";import"./Label-RJPM6nLR.js";import"./Hidden-BAVkFQWw.js";import"./useFocusRing-B4qSrPyS.js";import"./openLink-CV_TcEkD.js";import"./useLabel-Cp4A-_gp.js";import"./useLabels-B0EqUNWZ.js";import"./number-BYuAoFwI.js";import"./I18nProvider-CGCG23Ya.js";import"./useButton-DTMzfS5e.js";import"./usePress-CnualNnF.js";import"./textSelection-XO3NdvnZ.js";import"./useHover-D4699e1A.js";import"./FieldError-D_Mr9T0S.js";import"./Text-DpEEeOvr.js";import"./useFormValidation-DdO1uBuo.js";import"./ListBox-DiQH_mCN.js";import"./useCollection-B9NlIeHS.js";import"./keyboard-QF3EkhTC.js";import"./FocusScope-oWwmvnZH.js";import"./useEvent-CJepjbxE.js";import"./useControlledState-BXceL1Ef.js";import"./getItemCount-C1XLtSGc.js";import"./Autocomplete-k4dn0hvl.js";import"./useLocalizedStringFormatter-2Z2O1PD_.js";import"./useListState-CpxqJimO.js";import"./Dialog-IOmluWim.js";import"./Heading-BtuAv-cb.js";import"./useOverlayTriggerState-BQASwI2b.js";import"./VisuallyHidden-CvVmRX3H.js";import"./animation-CkKjJK8U.js";import"./useField-DvMrjFac.js";import"./useFormReset-CJ2gFrM1.js";import"./Input-BwG4UZpQ.js";import"./SearchField-CmqAR_hy.js";import"./useTextField-DhT4aJpW.js";import"./useFilter-5AYIsKvl.js";import"./useCollectionAdapter-BQzypb_I.js";import"./Avatar-QW8DKurt.js";import"./Skeleton-CPtCXXlo.js";import"./FieldLabel-DdNENsDH.js";import"./FieldError-sr_A1F3i.js";import"./Popover-DMmNkdzP.js";import"./Text-BSs-z84W.js";import"./ButtonIcon-CQGcwODg.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
