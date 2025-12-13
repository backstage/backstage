import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-DDGN0cGv.js";import{s as g,H as u}from"./plugin-DcGVZ5m9.js";import{c as h}from"./api-C5dqoa3s.js";import{c as f}from"./catalogApiMock-C7EdQie4.js";import{s as x}from"./api-QlE9xgJi.js";import{S as y}from"./SearchContext-CENdRfZX.js";import{P as S}from"./Page-yUyCZ3Oe.js";import{S as r}from"./Grid-D5cwdvdp.js";import{b as k,a as j,c as C}from"./plugin-DVGBlnIw.js";import{T as P}from"./TemplateBackstageLogo-BAMfgDbP.js";import{T}from"./TemplateBackstageLogoIcon-CrliIgwa.js";import{e as I}from"./routes-DFoOfbNi.js";import{w as v}from"./appWrappers-C8vp-7ey.js";import{s as G}from"./StarredEntitiesApi-DlgLMFKZ.js";import{M as A}from"./MockStarredEntitiesApi-BdsTkwyv.js";import{I as B}from"./InfoCard-_Sz2aZkG.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C9NKfyH6.js";import"./Plugin-CBvsz8vm.js";import"./componentData-lXmOowuG.js";import"./useAnalytics-CyvQxdhU.js";import"./useApp-CWuHwuj4.js";import"./useRouteRef-6TTRl5Mq.js";import"./index-DCDfH_Li.js";import"./ref-C0VTUPuL.js";import"./lodash-Y_-RFQgK.js";import"./useAsync-2V8xCCu6.js";import"./useMountedState-DWcF_6cb.js";import"./DialogTitle-CZfoj8Tu.js";import"./Modal-y_bxeVJ1.js";import"./Portal-BqHzn-UB.js";import"./Backdrop-0jy0HFas.js";import"./Button-BfPTYQOm.js";import"./useObservable-DAxbAlyD.js";import"./useIsomorphicLayoutEffect-B9TlIMZW.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-D6aqZ2EH.js";import"./ErrorBoundary-LiF7Clop.js";import"./ErrorPanel-sm5fOIxM.js";import"./WarningPanel-BvxUrI8I.js";import"./ExpandMore-DdbG_Iny.js";import"./AccordionDetails-D8hpySZx.js";import"./index-B9sM2jn7.js";import"./Collapse-1BtLbcFp.js";import"./MarkdownContent-D_mSSllG.js";import"./CodeSnippet-DUu5zKgy.js";import"./Box-Ddxf02Aa.js";import"./styled-BpU391Me.js";import"./CopyTextButton-K6z11-1u.js";import"./useCopyToClipboard-BVpL61aI.js";import"./Tooltip-DRtRsFO2.js";import"./Popper-LrvUQOcS.js";import"./List-B6XxVgNa.js";import"./ListContext-BfPeZX-c.js";import"./ListItem-B4p-bJZY.js";import"./ListItemText-D6aBcig9.js";import"./LinkButton-Dund-JVG.js";import"./Link-UwAe9NOh.js";import"./CardHeader-tCD53RXU.js";import"./Divider-nJoj97pl.js";import"./CardActions-CHc_Iyiq.js";import"./BottomLink-DHFnJkTT.js";import"./ArrowForward-KHx9CCNT.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
