import{aO as x,r as b,aP as P,j as e,p as f,M as y}from"./iframe-BYYe_BET.js";import{P as l}from"./PluginHeader-DlWuLMuq.js";import{C as p}from"./Container-jb-r-QsI.js";import{T as t}from"./Text-B33oXa7b.js";import{B as j}from"./BUIProvider-By5rpXjK.js";import"./preload-helper-PPVm8Dsz.js";import"./index-COE7Jz9g.js";import"./utils-CJSyyO3-.js";import"./useObjectRef-9OXtpzcu.js";import"./useCollection-DqLEpLDM.js";import"./useFocusRing-BRx5O8Da.js";import"./openLink-BON_CNZm.js";import"./Hidden-c60OiMP4.js";import"./keyboard-DfJpn7U5.js";import"./getMetaValue-Bn1etyTW.js";import"./FocusScope-D48ubNpo.js";import"./useEvent-B1WEd5Ze.js";import"./I18nProvider-rRNMaJeu.js";import"./usePress-CdThG8-6.js";import"./textSelection-D5BzNUOh.js";import"./useControlledState-DguQehpe.js";import"./Link-Cm2DuzGn.js";import"./useLink-PyDueBaS.js";import"./useHover-DawSjhGk.js";import"./useLocalizedStringFormatter-yKTdty33.js";import"./Button-DEPxcD8C.js";import"./Label-Bs-x77sn.js";import"./useLabel-dcXziXhr.js";import"./useLabels-4i8ghj68.js";import"./number-CtW1NSkQ.js";import"./useButton-f7nJByYc.js";import"./Menu-C2kjSQqD.js";import"./Autocomplete-DPgl-JtA.js";import"./useLoadMoreSentinel-CNEYEidD.js";import"./Input-BCQuwCc2.js";import"./ListBox-D6VaTCxL.js";import"./SelectionIndicator-kuT3rs5m.js";import"./Text-DCKtGqqk.js";import"./useListState-BNvxBoXz.js";import"./Dialog-5N2H3Til.js";import"./Heading-BulpGcy4.js";import"./useOverlayTriggerState-B9znxEmb.js";import"./VisuallyHidden-DOvpC764.js";import"./animation-DtpQ2ZDK.js";import"./SearchField-DO5H9G35.js";import"./FieldError-lvCPLHt0.js";import"./Form-DuiANyPI.js";import"./useFormValidation-DJxngnhN.js";import"./useTextField-D_S0Erlu.js";import"./useField-CTlO1gOc.js";import"./useFormReset-CgEuTYmc.js";import"./Virtualizer-B586PFaq.js";import"./useFilter-CZi588_R.js";import"./getNodeText-Bdrh_1kq.js";import"./Link-1Yd9vpsu.js";import"./useResolvedHref-C1qAVxpR.js";import"./Tooltip-B3Py3aUh.js";import"./VisuallyHidden-BzfP5imd.js";import"./Tabs-uA2wGW7X.js";import"./useHasTabbableChild-C_riEbXC.js";import"./BUIRoutingProvider-DagVjI_D.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=P(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=f.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...s.input.parameters?.docs?.source}}};const _e=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,_e as __namedExportsOrder};
