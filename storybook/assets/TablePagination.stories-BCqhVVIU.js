import{T as P}from"./TablePagination-DzJWlTom.js";import"./iframe-CPZQIdXt.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-Bd12eOMu.js";import"./index-DvySIO-N.js";import"./Select-CDAmy-jL.js";import"./Button-DbyB3ML5.js";import"./utils-DfS0MLG1.js";import"./Label-CBzuLVn0.js";import"./Hidden-DOapgqgb.js";import"./useFocusRing--8mLVlO1.js";import"./openLink-C87naxyd.js";import"./useLabel-NKDByoxa.js";import"./useLabels-j_pZQhad.js";import"./number-VnPE9G7J.js";import"./I18nProvider--qafPNbZ.js";import"./useButton-NJXPyhR_.js";import"./usePress-Oa17hApX.js";import"./textSelection-Comt_RX9.js";import"./useHover-CNFNn4CS.js";import"./FieldError-Dygq4nAa.js";import"./Text-p0WAAzoH.js";import"./useFormValidation-esOLhpCP.js";import"./ListBox-D4atw1Zc.js";import"./useCollection-DfAm7AFo.js";import"./keyboard-qwYU4mPS.js";import"./FocusScope-1iLQ0ib0.js";import"./useEvent-D7WD1hZR.js";import"./useControlledState-C1C-unW2.js";import"./getItemCount-SrAkk7Ev.js";import"./Autocomplete-BFWBSmC8.js";import"./useLocalizedStringFormatter-BLPR5mwD.js";import"./useListState-CNdvtHz-.js";import"./Dialog-C46yy6Vw.js";import"./Heading-DOTNhqTx.js";import"./useOverlayTriggerState-CAB3T-Hz.js";import"./VisuallyHidden-DfN5lpxa.js";import"./animation-ClFfzpbX.js";import"./useField-DbqECwXJ.js";import"./useFormReset-sDuCpydg.js";import"./Input-CulmNUpA.js";import"./SearchField-BgXj75f9.js";import"./useTextField-B0m-e8cO.js";import"./useFilter-Dcd5_XLa.js";import"./useCollectionAdapter-vM7CmWsb.js";import"./Avatar-C0JI0fvc.js";import"./Skeleton-CSEPv8Zb.js";import"./FieldLabel-DH8_qVc2.js";import"./FieldError-DmfO7x--.js";import"./Popover-CwSwJJok.js";import"./Text-YBNUwyLP.js";import"./ButtonIcon-7FFea3sd.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
