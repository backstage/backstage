import{aO as x,r as b,aP as P,j as e,p as f,M as y}from"./iframe-osqb7I7f.js";import{P as l}from"./PluginHeader--MXjUMu2.js";import{C as p}from"./Container-CMRara4W.js";import{T as t}from"./Text-CTlezMwF.js";import{B as j}from"./BUIProvider-D_Y7cW6n.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DwIBA9cq.js";import"./utils-C6BeXBHQ.js";import"./useObjectRef-BZCAlVk9.js";import"./useCollection-40RUHW7U.js";import"./useFocusRing-CQWExipe.js";import"./openLink-Dy9KSOrl.js";import"./Hidden-BoP2pNUM.js";import"./keyboard-Uhp3bD4I.js";import"./getMetaValue-4uTB8c1-.js";import"./FocusScope-CKCM-yJa.js";import"./useEvent-CE4CgK68.js";import"./I18nProvider-CsDtc1Vo.js";import"./usePress-Dn790MAk.js";import"./textSelection-jaE6bIEi.js";import"./useControlledState-DMCdQE-I.js";import"./Link-BnhUPUyl.js";import"./useLink-HxM-psWb.js";import"./useHover-C6cSG5OI.js";import"./useLocalizedStringFormatter-D8oGcEPo.js";import"./Button-BIQxkz6R.js";import"./Label-Dc6bt0j8.js";import"./useLabel-CwKyruxE.js";import"./useLabels-U9TV3Uv2.js";import"./number-RCfGZXCh.js";import"./useButton-BK3KpZgP.js";import"./Menu-49fRqpFV.js";import"./Autocomplete-Cl89j45E.js";import"./useLoadMoreSentinel-C8XxAFFz.js";import"./Input-CXF4SC00.js";import"./ListBox-Bxol7Xe6.js";import"./SelectionIndicator-DU8v45nn.js";import"./Text-BtxPcA8W.js";import"./useListState-yOfcTRaq.js";import"./Dialog-CMeLZcWJ.js";import"./Heading-UwJ90HiN.js";import"./useOverlayTriggerState-dYbDbyry.js";import"./VisuallyHidden-DaXqQ9Ff.js";import"./animation-BsqcNdGe.js";import"./SearchField-C7ECccKL.js";import"./FieldError-s1w9dgOY.js";import"./Form-4MSHWhmU.js";import"./useFormValidation-BDG5TrNG.js";import"./useTextField-nejwz2I7.js";import"./useField-D5QoDmxq.js";import"./useFormReset-BLi1GwHW.js";import"./Virtualizer-D40gzUmB.js";import"./useFilter-DtlDZTx0.js";import"./getNodeText-CEF3bHVP.js";import"./Link-BUKrLQp2.js";import"./useResolvedHref-BAQDC_wh.js";import"./Tooltip-DqfZ8k9F.js";import"./VisuallyHidden-CHGjqmQA.js";import"./Tabs-OQkUjY9z.js";import"./useHasTabbableChild-CVosybuq.js";import"./BUIRoutingProvider-ByqLAZ_I.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=P(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
