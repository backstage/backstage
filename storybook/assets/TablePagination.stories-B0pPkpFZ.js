import{T as l}from"./TablePagination-0LWy4UBd.js";import"./iframe-DBsVXRYe.js";import"./preload-helper-PPVm8Dsz.js";import"./clsx-B-dksMZM.js";import"./useStyles-ygfmXCT9.js";import"./index-DHoTzoGa.js";import"./useObjectRef-IXu9J1wk.js";import"./Select-3OUt9rJL.js";import"./Dialog-DR6WdkKl.js";import"./Button-ej80r4i7.js";import"./utils-CfMDylIf.js";import"./Label-BjQLMAOF.js";import"./Hidden-CTN0pdgd.js";import"./useFocusable-CINY0Ell.js";import"./useLabel-B1HzYN67.js";import"./useLabels-CVcX7O3a.js";import"./context-Cgi1B9S4.js";import"./useButton-CAv_GMQx.js";import"./usePress-C6DQ5Myx.js";import"./useFocusRing-hILYSl7p.js";import"./RSPContexts-B1LQg2VI.js";import"./OverlayArrow-CpxEkKj6.js";import"./useControlledState-D3VwFpoB.js";import"./SelectionManager-DuCQHMKr.js";import"./useEvent-CDxAO4ft.js";import"./SelectionIndicator-DKJFBkqO.js";import"./Separator-CwoWBkPL.js";import"./Text-BPqp3rsX.js";import"./useLocalizedStringFormatter-vKMt2D79.js";import"./animation-C6BgWy_U.js";import"./VisuallyHidden-DVrPZ1Lx.js";import"./FieldError-CpPzdhsb.js";import"./Form-Cy_j_Kzo.js";import"./ListBox-BUjxfdgT.js";import"./useListState-BVFTFBNU.js";import"./useField-BPLNPWDD.js";import"./useFormReset-BY-YQd2-.js";import"./Popover.module-DeEiA6vT.js";import"./Autocomplete-DIDQ5OXW.js";import"./Input-BVUoJ6B3.js";import"./SearchField-CG5oVnZI.js";import"./FieldLabel-DSB1eMEj.js";import"./FieldError-DOrvp6PX.js";import"./ButtonIcon-O-w-i2-U.js";import"./defineComponent-C5DMs0kR.js";import"./useBg-k0Q-GIg9.js";import"./Text-DrZI88_f.js";const p=()=>{},pe={title:"Backstage UI/TablePagination",component:l,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},a={args:{...e.args}},o={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},s={args:{...e.args,showPageSizeOptions:!1}},t={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:c,totalCount:m})=>{const u=Math.floor((g??0)/c)+1,P=Math.ceil((m??0)/c);return`Page ${u} of ${P}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => (
  <TablePagination
    offset={0}
    pageSize={10}
    totalCount={100}
    hasNextPage
    hasPreviousPage={false}
    onNextPage={noop}
    onPreviousPage={noop}
    onPageSizeChange={noop}
    showPageSizeOptions
  />
);
`,...e.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const FirstPage = () => <TablePagination />;
`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{code:`const LastPage = () => (
  <TablePagination offset={90} hasNextPage={false} hasPreviousPage />
);
`,...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const MiddlePage = () => <TablePagination offset={40} hasPreviousPage />;
`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const WithoutPageSizeOptions = () => (
  <TablePagination showPageSizeOptions={false} />
);
`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{code:`const CursorPagination = () => <TablePagination offset={undefined} />;
`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{code:`const CustomLabel = () => (
  <TablePagination
    offset={20}
    hasPreviousPage
    getLabel={({ offset, pageSize, totalCount }) => {
      const page = Math.floor((offset ?? 0) / pageSize) + 1;
      const totalPages = Math.ceil((totalCount ?? 0) / pageSize);
      return \`Page \${page} of \${totalPages}\`;
    }}
  />
);
`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{code:`const EmptyState = () => <TablePagination totalCount={0} hasNextPage={false} />;
`,...i.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...e.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  }
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 90,
    hasNextPage: false,
    hasPreviousPage: true
  }
}`,...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 40,
    hasPreviousPage: true
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    showPageSizeOptions: false
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: undefined
  }
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const ce=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{t as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,a as FirstPage,o as LastPage,r as MiddlePage,s as WithoutPageSizeOptions,ce as __namedExportsOrder,pe as default};
