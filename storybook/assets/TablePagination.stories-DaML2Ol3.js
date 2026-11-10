import{T as P}from"./TablePagination-CaYNcp_k.js";import"./iframe-S5OJNhaE.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-Ce7Pg0IE.js";import"./index-BC5M37nw.js";import"./Select-p1AhMhVV.js";import"./Button-C2Hm-9-t.js";import"./utils-Bf43CEqe.js";import"./Label-Dm19jsZB.js";import"./Hidden-bbdHFmyf.js";import"./useFocusRing-DrNn4w0v.js";import"./openLink-gCGEI6Hl.js";import"./useLabel-D6KUrPXz.js";import"./useLabels-lt4DDiFl.js";import"./number-DPETitzY.js";import"./I18nProvider-B9PKsfTQ.js";import"./useButton-ZsuQVD8S.js";import"./usePress-BKUcGSaX.js";import"./textSelection-C5XFxsbn.js";import"./getMetaValue-DfvZTkcg.js";import"./useHover-DRBklp1Y.js";import"./FieldError-B0-R75VP.js";import"./Text-CxFSOtlL.js";import"./Form-CdsOyD6B.js";import"./useFormValidation-CHoAG3iu.js";import"./ListBox-3Aeqh9PT.js";import"./useCollection-k8pWz5ND.js";import"./keyboard-DsBCMzZY.js";import"./FocusScope-C1MKzIWs.js";import"./useEvent-BTfti7hW.js";import"./useControlledState-sjWVeRbh.js";import"./useLoadMoreSentinel-BFnt0SFw.js";import"./Autocomplete-D8VeH8Ib.js";import"./useLocalizedStringFormatter-FCJD34ts.js";import"./SelectionIndicator-CRRCNCtd.js";import"./useListState-CXSz469O.js";import"./Dialog-BiUzqtUJ.js";import"./Heading-C94RofTM.js";import"./useOverlayTriggerState-C-PPUK0B.js";import"./VisuallyHidden-DVzk229T.js";import"./animation-D5KQd_1z.js";import"./useField-C9JYPx-z.js";import"./useFormReset-CTFIfjuR.js";import"./Input-eHTkKayp.js";import"./SearchField-meulwOzD.js";import"./useTextField-XvGvtHKV.js";import"./useFilter-7KI-EPr5.js";import"./useCollectionAdapter-B1DGA-Ap.js";import"./Avatar-D-JU7Tb9.js";import"./Skeleton-BtsHZZyr.js";import"./FieldLabel-Cd2JdbHL.js";import"./FieldError-Cu4qh9di.js";import"./Popover-BsqBMY_f.js";import"./Text-bGH6hxSc.js";import"./ButtonIcon-Chc3svF-.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
