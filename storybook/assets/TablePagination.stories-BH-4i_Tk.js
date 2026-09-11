import{T as P}from"./TablePagination-BfUCuTs4.js";import"./iframe-DwtLqRd0.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-C3WIJKuW.js";import"./index-BnPMaZ6y.js";import"./Select-B6wqJHmK.js";import"./Button-CN2KE0n5.js";import"./utils-CTdfKX7K.js";import"./Label-CnMUtZHy.js";import"./Hidden-Bs1ekBhh.js";import"./useFocusRing-Br9K8cEf.js";import"./openLink-Chp0fPN0.js";import"./useLabel-csUjoQn4.js";import"./useLabels-DBBGWQnZ.js";import"./number-Bm7tKJss.js";import"./I18nProvider-nGJGLiEq.js";import"./useButton-A_NfRVcv.js";import"./usePress-C5TgjZ1H.js";import"./textSelection-DEZhmmiP.js";import"./useHover-BPNWkg3J.js";import"./FieldError-ByLzKSOg.js";import"./Text-D3MLSvb0.js";import"./useFormValidation-BqQPhjWZ.js";import"./ListBox-Db4EOL_2.js";import"./useCollection-Dtw8-78S.js";import"./keyboard-CXKWpkVO.js";import"./FocusScope-CvoqOTaC.js";import"./useEvent-Da_JgobS.js";import"./useControlledState-kobszWOc.js";import"./getItemCount-B2Ys6B1c.js";import"./Autocomplete-GDZQu3ze.js";import"./useLocalizedStringFormatter-DkppfKGx.js";import"./useListState-Dc-wcePZ.js";import"./Dialog-BmYwBfNU.js";import"./Heading-Ziqlmepr.js";import"./useOverlayTriggerState-tkyO9oaJ.js";import"./VisuallyHidden-xymX9zNU.js";import"./animation-WaI6kgjy.js";import"./useField-DUtDhHm2.js";import"./useFormReset-DUch7r1q.js";import"./Input-DheUuQ7S.js";import"./SearchField-Br1xdp-y.js";import"./useTextField-BTrQ00No.js";import"./useFilter-BM6JxSLk.js";import"./useCollectionAdapter-DgkspMqr.js";import"./Avatar-Dcyo8tEZ.js";import"./Skeleton-CWwRBNTo.js";import"./FieldLabel-Bw4Kp8wk.js";import"./FieldError-CHSBQ6yu.js";import"./Popover-wax6L2Vv.js";import"./Text-BfBp2i3A.js";import"./ButtonIcon-DLANXsyX.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
