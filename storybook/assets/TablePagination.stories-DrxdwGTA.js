import{T as P}from"./TablePagination-BKPOrxC8.js";import"./iframe-C7lYm63e.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-aANnWHv4.js";import"./index-YLMOL70x.js";import"./Select-Becqk32R.js";import"./BUIRoutingProvider-BQOAZjhP.js";import"./useFocusRing-DBYmBdNX.js";import"./Button-9cVhP8ym.js";import"./utils-BUzKzuKz.js";import"./Label-BN9dytpW.js";import"./Hidden-C01qEBuY.js";import"./useLabel-CLnEY2ws.js";import"./useLabels-B_JIZiXA.js";import"./number-Ctxb0h4T.js";import"./I18nProvider-cMES1Ye-.js";import"./useButton-DYcDcyWL.js";import"./usePress-DfP9K6Oc.js";import"./textSelection-DvQ0zR-N.js";import"./getMetaValue-C1Arjnva.js";import"./useHover-Dh_5CIee.js";import"./FieldError-DSs23qmd.js";import"./Text-BaJbPGan.js";import"./Form-zZEEHrPM.js";import"./useFormValidation-DUls_W6A.js";import"./ListBox-DHywnJr5.js";import"./useCollection-DWXA0qb2.js";import"./keyboard-COdNUR9C.js";import"./FocusScope-CQmsnwev.js";import"./useEvent-Bz_EWePK.js";import"./useControlledState-BNzUk4rc.js";import"./useLoadMoreSentinel-DH8UKFQx.js";import"./Autocomplete-nYZs8amC.js";import"./useLocalizedStringFormatter-YAhVtzvN.js";import"./SelectionIndicator-DMtbktx0.js";import"./useListState-BKK6D36b.js";import"./Dialog-CNfDll7A.js";import"./Heading-DFG6W8uO.js";import"./useOverlayTriggerState-BmV-E52M.js";import"./VisuallyHidden-H9cJaS2-.js";import"./animation-DANnDqD6.js";import"./useField-k9YTPZiv.js";import"./useFormReset-BEQYUo_O.js";import"./Input-Bl4PdeGR.js";import"./SearchField-Bnn9KBeb.js";import"./useTextField-7X0JhYHF.js";import"./useFilter-BMWcoDs4.js";import"./useCollectionAdapter-Dow9kNZy.js";import"./Avatar-C6eg07Dl.js";import"./Skeleton-DdRl_XuH.js";import"./FieldLabel-DLlCf0lb.js";import"./FieldError-BAk-nb_O.js";import"./Popover-Qp4vOpVj.js";import"./Text-hWRyQHsT.js";import"./ButtonIcon-Ba0ONmbh.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
