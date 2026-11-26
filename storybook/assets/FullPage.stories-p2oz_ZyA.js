import{aD as x,r as b,aE as f,j as e,p as P}from"./iframe-7sCYbwMA.js";import{T as y}from"./TestRouter-CIUVCPAh.js";import{P as l}from"./PluginHeader-C-9cFqi0.js";import{C as p}from"./Container-6hb4jsxs.js";import{T as t}from"./Text-zdsrOI4J.js";import{B as j}from"./BUIProvider-D7bQEjvA.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CohR7ztA.js";import"./index-DXJUlwCm.js";import"./utils-9GxVsiDp.js";import"./useObjectRef-B-PPvPC_.js";import"./useCollection-BylKB84X.js";import"./useFocusRing-DtQAi71R.js";import"./Hidden-CI0OECmE.js";import"./keyboard-kxvRVjZ1.js";import"./getMetaValue-BOiM-Q3U.js";import"./FocusScope-Bn75Rqdl.js";import"./useEvent-DecXtKIc.js";import"./I18nProvider-CNZdU0-i.js";import"./usePress-CQso2Ktw.js";import"./textSelection-oDhLNlBr.js";import"./useControlledState-C8ScjM6r.js";import"./Link-DFonM9Xl.js";import"./useLink-C7y3xXYf.js";import"./useHover-Bvne2y_8.js";import"./useLocalizedStringFormatter-BejVMsWK.js";import"./Button-DGrW_YAy.js";import"./Label-LRQoVPax.js";import"./useLabel-BFjYAAvj.js";import"./useLabels-BJlFaWLE.js";import"./number-D8Tvkt0y.js";import"./useButton-Drv-lwD1.js";import"./Menu-Bc_RjRYs.js";import"./Autocomplete-M71SjeIb.js";import"./useLoadMoreSentinel-C4OgTpVn.js";import"./Input-BK9q61TK.js";import"./ListBox-CRkY3W8z.js";import"./SelectionIndicator-CLAutkK-.js";import"./Text-CuaSCD0n.js";import"./useListState-B2P8Ysr7.js";import"./Dialog-DQjsbsjj.js";import"./Heading-DEwrYAgS.js";import"./useOverlayTriggerState-nkxvKS82.js";import"./VisuallyHidden-BbBCn6_h.js";import"./animation-CpHqW5GJ.js";import"./SearchField-BO2oypE5.js";import"./FieldError-D7hchg2Y.js";import"./Form-DLTQ6Zj9.js";import"./useFormValidation-DK3qTci6.js";import"./useTextField-VNmKoJ-w.js";import"./useField-BPHR2NpW.js";import"./useFormReset-CeH0vvgE.js";import"./Virtualizer-CjC6NR1M.js";import"./useFilter-B75V2q3l.js";import"./getNodeText-HaqtCM3s.js";import"./BUIRoutingProvider-DiU1oZiY.js";import"./Link-ItuZ1RPU.js";import"./Tooltip-Kh4-HhuL.js";import"./useTooltipTriggerState-BU8FIDCu.js";import"./VisuallyHidden-C8HOZ2ta.js";import"./Tabs-DRBTnFiF.js";import"./useHasTabbableChild-DTTJdF-v.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=f(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=P.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...o.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...a.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...s.input.parameters?.docs?.source}}};const De=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,De as __namedExportsOrder};
