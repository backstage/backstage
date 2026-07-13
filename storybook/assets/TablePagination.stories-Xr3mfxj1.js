import{T as P}from"./TablePagination-DAKbltTs.js";import"./iframe-C134ftd_.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-CpAZkPjD.js";import"./index-CFfinTmq.js";import"./Select-CYQkNh5O.js";import"./Button-DokUs05S.js";import"./utils-ZhLQjZIu.js";import"./Label-NvoSwhWO.js";import"./Hidden-Bciv724x.js";import"./useFocusRing-CEbL5n3V.js";import"./openLink-CXjQqT5j.js";import"./useLabel-BlNKan1O.js";import"./useLabels-DE_o1GVW.js";import"./number-DOH9yOte.js";import"./I18nProvider-C3aQlN23.js";import"./useButton-DhiKPbl2.js";import"./usePress-DEZzIpor.js";import"./textSelection-DpSIhvEg.js";import"./useHover-crLX5QKB.js";import"./FieldError-D65LPVQm.js";import"./Text-rWPrkzXG.js";import"./useFormValidation-s9lT5xWl.js";import"./ListBox-DK43SL3j.js";import"./useCollection-BLpgqlp1.js";import"./keyboard-DADZJZiJ.js";import"./FocusScope-B-HDfZvI.js";import"./useEvent-B_Hi0sbr.js";import"./useControlledState-BrUi6TrE.js";import"./getItemCount-Dnk46TUF.js";import"./Autocomplete-BAT25Rh4.js";import"./useLocalizedStringFormatter-gRbl-cPk.js";import"./useListState-1wcvBglp.js";import"./Dialog-CJvfjboe.js";import"./Heading-pVOpDmGw.js";import"./useOverlayTriggerState-CWuf6Tnn.js";import"./VisuallyHidden-nqqisxk3.js";import"./animation-D0n23P1z.js";import"./useField-By1WoCRi.js";import"./useFormReset-CQi6w5nh.js";import"./Input-BaAA-Nyt.js";import"./SearchField-Bquvp4Zp.js";import"./useTextField-C8rV1cT7.js";import"./useFilter-zE2QSO7i.js";import"./useCollectionAdapter-BKlM0i6Y.js";import"./Avatar-C1aktYmZ.js";import"./Skeleton-D4rtXZvB.js";import"./FieldLabel-X1Qa6MCe.js";import"./FieldError-B3m0AjM9.js";import"./Popover-TfotZhjD.js";import"./Text-CMUSX-Wb.js";import"./ButtonIcon-RiLYN9tl.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
