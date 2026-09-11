import{be as b,c8 as x,cE as P,bQ as e,c5 as f,w as y}from"./iframe-DwtLqRd0.js";import{P as l}from"./PluginHeader-Dt_lJ7Z7.js";import{C as p}from"./Container-Di6kmp2F.js";import{T as t}from"./Text-BfBp2i3A.js";import{B as j}from"./BUIProvider-c6TORPmv.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BnPMaZ6y.js";import"./utils-CTdfKX7K.js";import"./useObjectRef-C3WIJKuW.js";import"./useCollection-Dtw8-78S.js";import"./useFocusRing-Br9K8cEf.js";import"./openLink-Chp0fPN0.js";import"./Hidden-Bs1ekBhh.js";import"./keyboard-CXKWpkVO.js";import"./FocusScope-CvoqOTaC.js";import"./useEvent-Da_JgobS.js";import"./I18nProvider-nGJGLiEq.js";import"./usePress-C5TgjZ1H.js";import"./textSelection-DEZhmmiP.js";import"./useControlledState-kobszWOc.js";import"./Link-ykMGma3z.js";import"./useLink-RKpisWeZ.js";import"./useHover-BPNWkg3J.js";import"./useLocalizedStringFormatter-DkppfKGx.js";import"./Button-CN2KE0n5.js";import"./Label-CnMUtZHy.js";import"./useLabel-csUjoQn4.js";import"./useLabels-DBBGWQnZ.js";import"./number-Bm7tKJss.js";import"./useButton-A_NfRVcv.js";import"./Menu-D2shjVTr.js";import"./Autocomplete-GDZQu3ze.js";import"./getItemCount-B2Ys6B1c.js";import"./Input-DheUuQ7S.js";import"./ListBox-Db4EOL_2.js";import"./Text-D3MLSvb0.js";import"./useListState-Dc-wcePZ.js";import"./Dialog-BmYwBfNU.js";import"./Heading-Ziqlmepr.js";import"./useOverlayTriggerState-tkyO9oaJ.js";import"./VisuallyHidden-xymX9zNU.js";import"./animation-WaI6kgjy.js";import"./SearchField-Br1xdp-y.js";import"./FieldError-ByLzKSOg.js";import"./useFormValidation-BqQPhjWZ.js";import"./useTextField-BTrQ00No.js";import"./useField-DUtDhHm2.js";import"./useFormReset-DUch7r1q.js";import"./Virtualizer-CH6ogsth.js";import"./useFilter-BM6JxSLk.js";import"./getNodeText-Cr68wGR8.js";import"./Link-pUSlk80E.js";import"./useResolvedHref-B6eHfBkG.js";import"./Tooltip-DaCyvBEk.js";import"./VisuallyHidden-uxRsmqIB.js";import"./Tabs-C56M-PHR.js";import"./useHasTabbableChild-DhYHlDvd.js";import"./BUIRoutingProvider-D8L55R8m.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=f.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" />
      <FullPage style={{
      backgroundColor: '#c3f0ff'
    }}>
        <Container>
          <Text as="p">
            This content fills the remaining viewport height below the Header.
          </Text>
        </Container>
      </FullPage>
    </>
})`,...o.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" />
      <FullPage>
        <Container>
          <Text as="h2" variant="title-medium">
            Scrollable Content
          </Text>
          <Text as="p">
            The content below scrolls independently while the Header stays
            pinned at the top.
          </Text>
          {paragraphs}
        </Container>
      </FullPage>
    </>
})`,...s.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" tabs={tabs} />
      <FullPage>
        <Container>
          <Text as="p">
            The FullPage height adjusts automatically when the Header includes
            tabs, thanks to the ResizeObserver measuring the Header's actual
            height.
          </Text>
          {paragraphs}
        </Container>
      </FullPage>
    </>
})`,...a.input.parameters?.docs?.source}}};const Se=["Default","WithScrollableContent","WithTabs"];export{o as Default,s as WithScrollableContent,a as WithTabs,Se as __namedExportsOrder};
