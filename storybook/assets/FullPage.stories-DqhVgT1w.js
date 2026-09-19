import{aO as x,r as b,aP as P,j as e,p as f,M as y}from"./iframe-DIcQvc_4.js";import{P as l}from"./PluginHeader-Dnmt0S0u.js";import{C as p}from"./Container-DN6j8qRa.js";import{T as t}from"./Text-ybBQtNv8.js";import{B as j}from"./BUIProvider-DxF_USOs.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DeTGLoK4.js";import"./utils-JYodRznf.js";import"./useObjectRef-CQfKhSp8.js";import"./useCollection-CyoSzQaI.js";import"./useFocusRing-C4tfuByP.js";import"./openLink-BR6QeS5d.js";import"./Hidden-BBwtWmDi.js";import"./keyboard-taUe_H6E.js";import"./FocusScope-CEEamkqC.js";import"./useEvent-DE6s5RBO.js";import"./I18nProvider-BUw0KQ7A.js";import"./usePress-BIUzH6ox.js";import"./textSelection-DrSKaTGN.js";import"./useControlledState-CaCljqv7.js";import"./Link-TpHoehMS.js";import"./useLink-Cx56iYKh.js";import"./useHover-CrozpiDB.js";import"./useLocalizedStringFormatter-CpwYaMVi.js";import"./Button-C4PGOc91.js";import"./Label-CLke59gh.js";import"./useLabel-BYY4_2g1.js";import"./useLabels-ITbgZNHU.js";import"./number-D2azkskk.js";import"./useButton-QYfWJvVm.js";import"./Menu-pNzvAEuI.js";import"./Autocomplete-4JeE3WOL.js";import"./getItemCount-DD4SHQDj.js";import"./Input-DPAuMq7N.js";import"./ListBox-BlWbtl4n.js";import"./Text-CiWDOLRD.js";import"./useListState-GRJskBCg.js";import"./Dialog-BoJzSVC3.js";import"./Heading-DzNAi1Am.js";import"./useOverlayTriggerState-ovQ1kmtR.js";import"./VisuallyHidden-W2sx5irF.js";import"./animation-B_Bf72uX.js";import"./SearchField-CDlUIPhF.js";import"./FieldError-BmDNj2fS.js";import"./useFormValidation-DdNhI11s.js";import"./useTextField-Dx3e69-L.js";import"./useField-BhZZQjtf.js";import"./useFormReset-ZBhvFFWB.js";import"./Virtualizer-CPc_t5X-.js";import"./useFilter-CBueS5oQ.js";import"./getNodeText-Dbnr2VZW.js";import"./Link-CMpDi5u7.js";import"./useResolvedHref-9YFlmop0.js";import"./Tooltip-BBfUIfIG.js";import"./VisuallyHidden-RkqNIeYA.js";import"./Tabs-BTiCjwwY.js";import"./useHasTabbableChild-C1NRl8Gt.js";import"./BUIRoutingProvider-gwQ9m4v_.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
})`,...s.input.parameters?.docs?.source}}};const Se=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,Se as __namedExportsOrder};
