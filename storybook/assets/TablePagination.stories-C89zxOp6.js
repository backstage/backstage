import{T as P}from"./TablePagination--AJKnitK.js";import"./iframe-DQDMWdhR.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-Dh-vte6W.js";import"./index-2sXF39VV.js";import"./Select-rsSiTAXv.js";import"./Button-B9VXEm0C.js";import"./utils-B-ovU0-_.js";import"./Label-B6V4-sZF.js";import"./Hidden-Bb1SO8z8.js";import"./useFocusRing-Dqv3dHhs.js";import"./openLink-D1CPkxqm.js";import"./useLabel-B25DV_yj.js";import"./useLabels-Pb8F9YZg.js";import"./number-DW3XZZJ4.js";import"./I18nProvider-TsAeBo9n.js";import"./useButton-BEhmAWhs.js";import"./usePress-bGrT2q-a.js";import"./textSelection-CapKbKZh.js";import"./useHover-MC-zazTO.js";import"./FieldError-Bzv1nRs-.js";import"./Text-D9BpNmMe.js";import"./useFormValidation-DXQnm1J-.js";import"./ListBox-B2lPr2Kp.js";import"./useCollection-CDDSJ_P3.js";import"./keyboard-d2VMsAOu.js";import"./FocusScope-C-dw9Kb6.js";import"./useEvent-DOk9v1cy.js";import"./useControlledState-DZKUYVcn.js";import"./getItemCount-DTlkJI7A.js";import"./Autocomplete-C1KNIHyS.js";import"./useLocalizedStringFormatter-DpUfSixd.js";import"./useListState-C427duVV.js";import"./Dialog-DgJ7L2R4.js";import"./Heading-icsaBEzz.js";import"./useOverlayTriggerState-CsxDHpSG.js";import"./VisuallyHidden-cXX3uI8v.js";import"./animation-BJkZKSz0.js";import"./useField-CT7s6dvF.js";import"./useFormReset-BzTV__2L.js";import"./Input-CHBBdEkX.js";import"./SearchField-BfGwDBqA.js";import"./useTextField-Dk57rPxm.js";import"./useFilter-UAUuzkDh.js";import"./useCollectionAdapter-D2XGmXKe.js";import"./Avatar-CUC2Dc2J.js";import"./Skeleton-BCLyIEf5.js";import"./FieldLabel-DZYOHMMN.js";import"./FieldError-sQUdikz1.js";import"./Popover-TDp7f0yO.js";import"./Text-7gQB6XNM.js";import"./ButtonIcon-Du9hjoEE.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
