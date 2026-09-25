import{aO as x,r as b,aP as P,j as e,p as f,M as y}from"./iframe-SQ-DrL5X.js";import{P as l}from"./PluginHeader-B0F7iWY0.js";import{C as p}from"./Container-C6WDndl8.js";import{T as t}from"./Text-AZjGv-Pn.js";import{B as j}from"./BUIProvider-BlJs7uSL.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CmVRNaDw.js";import"./utils-DS6PrpIl.js";import"./useObjectRef-BvCpdf-D.js";import"./useCollection-YrQYX9l4.js";import"./useFocusRing-BjVI5GO7.js";import"./openLink-DWLtw0ci.js";import"./Hidden-ZDc1mtAl.js";import"./keyboard-xERIyYjI.js";import"./FocusScope-D5AOa8UF.js";import"./useEvent-Cl1lm5-9.js";import"./I18nProvider-z6RUFbQd.js";import"./usePress-DMyM15Qa.js";import"./textSelection-B-fLBI4W.js";import"./useControlledState-BLu3Mzk7.js";import"./Link-CIIDzTad.js";import"./useLink-CS8dRE_V.js";import"./useHover-DHCGAdFi.js";import"./useLocalizedStringFormatter-CHao35Rz.js";import"./Button-ChyeSkQq.js";import"./Label-CZqZr_x1.js";import"./useLabel-w96aGTJB.js";import"./useLabels-X84YCiAH.js";import"./number-CcK3WKXn.js";import"./useButton-BSkNsead.js";import"./Menu-og8QOSgn.js";import"./Autocomplete-DIjTkbA4.js";import"./getItemCount-jCJO8FnC.js";import"./Input-ByFHAFjD.js";import"./ListBox-CpUeOb2P.js";import"./Text-BW-I_WTv.js";import"./useListState-C4gaL_Hh.js";import"./Dialog-C_hxccYm.js";import"./Heading-D0gwOF84.js";import"./useOverlayTriggerState-DEML2GX7.js";import"./VisuallyHidden-CueUzKiJ.js";import"./animation-CoeCW5HE.js";import"./SearchField-Dy2eL_Nb.js";import"./FieldError-Dy6WAbxG.js";import"./useFormValidation-BDrZPX9Z.js";import"./useTextField-ScBV4IXz.js";import"./useField-DiPkCaUr.js";import"./useFormReset-CCiws3BY.js";import"./Virtualizer-DrIdU5GN.js";import"./useFilter-BmxzhHXe.js";import"./getNodeText-B9VZWzzY.js";import"./Link-pIPTPYTu.js";import"./useResolvedHref-0dOuUxIW.js";import"./Tooltip-pye6v7I6.js";import"./VisuallyHidden-DQ15yZo4.js";import"./Tabs-DBBfC_JQ.js";import"./useHasTabbableChild-DOAebxH-.js";import"./BUIRoutingProvider-ByqVwzoJ.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
