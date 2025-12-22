import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-DZkam7Bj.js";import{s as g,H as u}from"./plugin-Bl7BuGsa.js";import{c as h}from"./api-DliB_FM6.js";import{c as f}from"./catalogApiMock-DxFmppLJ.js";import{s as x}from"./api-apMlJzbK.js";import{S as y}from"./SearchContext-CxKaLjlh.js";import{P as S}from"./Page-CVY30iie.js";import{S as r}from"./Grid-DBMZs7np.js";import{b as k,a as j,c as C}from"./plugin-D6dEO2vP.js";import{T as P}from"./TemplateBackstageLogo-DMjCPBwX.js";import{T}from"./TemplateBackstageLogoIcon-C38sXuD6.js";import{e as I}from"./routes-CNUg9jsV.js";import{w as v}from"./appWrappers-Bg6ecWLG.js";import{s as G}from"./StarredEntitiesApi-BtUs4Rx8.js";import{M as A}from"./MockStarredEntitiesApi-DrdxhWLC.js";import{I as B}from"./InfoCard-DESjlp5V.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Cy-AkiNB.js";import"./Plugin-D0wcgIxz.js";import"./componentData-D2mgrz7C.js";import"./useAnalytics-RqWf-jVc.js";import"./useApp-CAfcC71X.js";import"./useRouteRef-BbGjzdGG.js";import"./index-BYedHEZ0.js";import"./ref-C0VTUPuL.js";import"./lodash-Y_-RFQgK.js";import"./useAsync-BRCkrjty.js";import"./useMountedState-ChfRzppL.js";import"./DialogTitle-BODx1QEM.js";import"./Modal-Dli2H9pG.js";import"./Portal-mqL5KVNN.js";import"./Backdrop-970MLPke.js";import"./Button-C84XLh64.js";import"./useObservable-CEhyWTyT.js";import"./useIsomorphicLayoutEffect-DFCzL8zZ.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-m46vxV1w.js";import"./ErrorBoundary-UF8MZD5v.js";import"./ErrorPanel-DvnF6D1Z.js";import"./WarningPanel-W5ZE-W22.js";import"./ExpandMore-B142-YHG.js";import"./AccordionDetails-4Wsid_gA.js";import"./index-B9sM2jn7.js";import"./Collapse-CyMpxX-e.js";import"./MarkdownContent-0F8rqmt_.js";import"./CodeSnippet-BFE5NLd5.js";import"./Box-DChwE7Ki.js";import"./styled-RI4GT_4U.js";import"./CopyTextButton-Bji7cX2P.js";import"./useCopyToClipboard-DSpaqeDH.js";import"./Tooltip-D0UPjqYE.js";import"./Popper-CT_phagK.js";import"./List-Ca4J4jzY.js";import"./ListContext-D7S-zqsj.js";import"./ListItem-DNrM1AYn.js";import"./ListItemText-CiywuPc3.js";import"./LinkButton-DWub5hGG.js";import"./Link-BoLwiIPW.js";import"./CardHeader-CDP-7wiu.js";import"./Divider-CrMgh5SC.js";import"./CardActions-DiMkl16p.js";import"./BottomLink-DmPOneGd.js";import"./ArrowForward-DJhLoZFc.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
