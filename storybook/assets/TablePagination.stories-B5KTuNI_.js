import{T as P}from"./TablePagination-CCArxWXS.js";import"./iframe-BS0xFXlr.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-DUcg5Ry6.js";import"./index-DiKBASFX.js";import"./Select-Dxi4p_FH.js";import"./BUIRoutingProvider-DEeoTJxk.js";import"./useFocusRing-DN0Vfw2w.js";import"./Button-CEQzuGsm.js";import"./utils-Cm8LN8Qs.js";import"./Label-CYKe4XnV.js";import"./Hidden-B4kfQ2c4.js";import"./useLabel-BuvGyTAc.js";import"./useLabels-BEdhgbVu.js";import"./number-BpBkSV7H.js";import"./I18nProvider-PG7J6CX1.js";import"./useButton-AcAPGB9_.js";import"./usePress-DqAt-yTJ.js";import"./textSelection-CBFVLC_r.js";import"./getMetaValue-gNZTl7Dq.js";import"./useHover-CBc8HZSH.js";import"./FieldError-B0W-gOBy.js";import"./Text-CuDGkaxu.js";import"./Form-Dzkw_-wT.js";import"./useFormValidation-BzvYcKAP.js";import"./ListBox-DW717lvJ.js";import"./useCollection-CRcYPZw_.js";import"./keyboard-0e26zbuq.js";import"./FocusScope-C2moZHGE.js";import"./useEvent-C9_3kZDD.js";import"./useControlledState--_QEZGZM.js";import"./useLoadMoreSentinel-CIdmQleI.js";import"./Autocomplete-w_NQzNO7.js";import"./useLocalizedStringFormatter-C0vYX1Z5.js";import"./SelectionIndicator-Br_IDV3_.js";import"./useListState-DFZV_VbF.js";import"./Dialog-BRsdJ6DX.js";import"./Heading-BiP5nQgc.js";import"./useOverlayTriggerState-BmqdnQuv.js";import"./VisuallyHidden-CTRcAVBz.js";import"./animation-C8VQ-2r7.js";import"./useField-D-T_edQG.js";import"./useFormReset-C6LGHf4l.js";import"./Input-C98m36Qq.js";import"./SearchField-CNkog-IN.js";import"./useTextField-QI3hhjLQ.js";import"./useFilter-XqScphGR.js";import"./useCollectionAdapter-C_U5sQKb.js";import"./Avatar-DRMSKHID.js";import"./Skeleton-E9G-y61l.js";import"./FieldLabel-BVIAPGB7.js";import"./FieldError-Df_NNgor.js";import"./Popover-DrA3aCnP.js";import"./Text-JYn98pBE.js";import"./ButtonIcon-CkaKpehC.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
