import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-DVllq_JJ.js";import{s as g,H as u}from"./plugin-B7hHNspn.js";import{c as h}from"./api-DzHDZ1RB.js";import{c as f}from"./catalogApiMock-DLCrqV4a.js";import{s as x}from"./api-CuPwg010.js";import{S as y}from"./SearchContext-CaUhcdO1.js";import{P as S}from"./Page-DhJK8fFk.js";import{S as r}from"./Grid-GLf92srY.js";import{b as k,a as j,c as C}from"./plugin-D3vE2yAH.js";import{T as P}from"./TemplateBackstageLogo-DJWr0CHR.js";import{T}from"./TemplateBackstageLogoIcon-03f1BulO.js";import{e as I}from"./routes-Dr5G0htj.js";import{w as v}from"./appWrappers-C9euYDcG.js";import{s as G}from"./StarredEntitiesApi-ByyHUoK5.js";import{M as A}from"./MockStarredEntitiesApi-DaRlCfK-.js";import{I as B}from"./InfoCard-CHyQV-0n.js";import"./preload-helper-D9Z9MdNV.js";import"./index-D1624cHW.js";import"./Plugin-DZCzK3PC.js";import"./componentData-ir7sX7tS.js";import"./useAnalytics-gDAqv4j8.js";import"./useApp-CkFK6AHh.js";import"./useRouteRef-Dq-yTMyo.js";import"./index-CuC9x3hw.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./useAsync-2B4YlYUd.js";import"./useMountedState-CAQUPkod.js";import"./DialogTitle-tzRl7hzM.js";import"./Modal-Iqgu4vP7.js";import"./Portal-BdFeljN4.js";import"./Backdrop-bmyTmjrQ.js";import"./Button-CqkFteVA.js";import"./useObservable-cKfOObA8.js";import"./useIsomorphicLayoutEffect-DMTlV3dY.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-BJRiL5GO.js";import"./ErrorBoundary-BL32Oe-y.js";import"./ErrorPanel-Yv09NjH-.js";import"./WarningPanel-CTVbrDnl.js";import"./ExpandMore-DeLbxlk1.js";import"./AccordionDetails-Df6QxQno.js";import"./index-DnL3XN75.js";import"./Collapse-BPkQPj1V.js";import"./MarkdownContent-C4WJ4LoY.js";import"./CodeSnippet-pYWcNvfR.js";import"./Box-DvszX2T2.js";import"./styled-DfELtcUs.js";import"./CopyTextButton-DyV_pNjJ.js";import"./useCopyToClipboard-DQH_xRRB.js";import"./Tooltip-CArIk1uN.js";import"./Popper-Bc5fPVw6.js";import"./List-B5MAQ6Y4.js";import"./ListContext-DE_PmqSG.js";import"./ListItem-DLfoHZ9h.js";import"./ListItemText-C9klhbSR.js";import"./LinkButton-CyMvoAXZ.js";import"./Link-Dfj65VZ1.js";import"./CardHeader-9ttq-nyk.js";import"./Divider-CjoboeOw.js";import"./CardActions-CigbsVLY.js";import"./BottomLink-C3Knj5tN.js";import"./ArrowForward-_2sqR9gC.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    svg,
    path,
    container
  } = useLogoStyles();
  return <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <Grid container justifyContent="center" spacing={6}>
            <HomePageCompanyLogo className={container} logo={<TemplateBackstageLogo classes={{
            svg,
            path
          }} />} />
            <Grid container item xs={12} justifyContent="center">
              <HomePageSearchBar InputProps={{
              classes: {
                root: classes.searchBarInput,
                notchedOutline: classes.searchBarOutline
              }
            }} placeholder="Search" />
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12} md={6}>
                <HomePageStarredEntities />
              </Grid>
              <Grid item xs={12} md={6}>
                <HomePageToolkit tools={Array(8).fill({
                url: '#',
                label: 'link',
                icon: <TemplateBackstageLogoIcon />
              })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoCard title="Composable Section">
                  {/* placeholder for content */}
                  <div style={{
                  height: 370
                }} />
                </InfoCard>
              </Grid>
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>;
}`,...o.parameters?.docs?.source}}};const zt=["DefaultTemplate"];export{o as DefaultTemplate,zt as __namedExportsOrder,Wt as default};
