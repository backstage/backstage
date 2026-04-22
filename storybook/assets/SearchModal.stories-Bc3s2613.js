import{j as t,W as d,a3 as u,a2 as h}from"./iframe-CC8dZ5v0.js";import{r as g}from"./plugin-CL-EzimQ.js";import{S as l,u as n,a as x}from"./useSearchModal-BZB25WoM.js";import{B as c}from"./Button-D-oxz3_H.js";import{D as S,a as f,b as M}from"./DialogTitle-ReYn1ncO.js";import{B as j}from"./Box-BhabvipW.js";import{S as r}from"./Grid-CCYqzPMW.js";import{S as C}from"./SearchType-bK0NIqZW.js";import{L as y}from"./List-D-_F1OrG.js";import{H as I}from"./DefaultResultListItem-Smo4hE-v.js";import{w as R}from"./appWrappers-D9KdZf3h.js";import{m as B}from"./makeStyles-DTH3glJL.js";import{s as D,M as k}from"./api-D4r0i8Z2.js";import{S as v}from"./SearchContext-BWF-VLBq.js";import{SearchBar as T}from"./SearchBar-CMnSxNzP.js";import{S as b}from"./SearchResult-B6Jo4DH9.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Bi_ML6Tf.js";import"./Plugin-BhEim6P4.js";import"./componentData-D7sGMfRh.js";import"./useAnalytics-4dX8X2S1.js";import"./useApp-DJZpM7fA.js";import"./useRouteRef-BK6uFU14.js";import"./ArrowForward-BbfO88sj.js";import"./translation-DK1bgbwD.js";import"./Page-4-f3NYYa.js";import"./useMediaQuery-CpQLvn__.js";import"./Divider-BDaqKUXC.js";import"./ArrowBackIos-Mr1yxuQv.js";import"./ArrowForwardIos-BCvOICAA.js";import"./translation-CXO-2UKF.js";import"./Modal-Zvs4RyO_.js";import"./Portal-COibyzBH.js";import"./Backdrop-CAcNXLNd.js";import"./styled-CM_Xf2DM.js";import"./ExpandMore-RARwx0Xw.js";import"./useAsync-Cubaspqz.js";import"./useMountedState-BiVC6Sna.js";import"./AccordionDetails-C7iUogkW.js";import"./index-B9sM2jn7.js";import"./Collapse-0iMZ9ReK.js";import"./ListItem-B4tF2XTx.js";import"./ListContext-Bfuv36sR.js";import"./ListItemIcon-BI2dA1qJ.js";import"./ListItemText-DP3OOKih.js";import"./Tabs-CN2KqYXF.js";import"./KeyboardArrowRight-B_npc3qv.js";import"./FormLabel-D7DoMOF4.js";import"./formControlState-CT258kkI.js";import"./InputLabel-BG7iNks-.js";import"./Select-DiStTNdo.js";import"./Popover-CphrO87E.js";import"./MenuItem-BNGZSNlf.js";import"./Checkbox-DG0ezfCy.js";import"./SwitchBase-pednpeve.js";import"./Chip-aD7C19lk.js";import"./Link-ORDuPGhJ.js";import"./index-twBdpm7Y.js";import"./lodash-BzWoCuL2.js";import"./WebStorage-LHAAa8QN.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DaufeE-G.js";import"./useIsomorphicLayoutEffect-BxcoVzAb.js";import"./BUIProvider-Dk-mSEjq.js";import"./openLink-R4xAzZJL.js";import"./useResolvedHref-B0IX69ve.js";import"./Search-D-Bk3eAp.js";import"./useDebounce-5HhWj6nL.js";import"./InputAdornment-9IPNW587.js";import"./TextField-4M3OxEyF.js";import"./useElementFilter-CSzgEb2h.js";import"./EmptyState-BdBMH1f7.js";import"./Progress-DlVLgd7k.js";import"./LinearProgress-BgvcftTI.js";import"./ResponseErrorPanel-82b65C3D.js";import"./ErrorPanel-CLfUZ9ms.js";import"./WarningPanel-CIUGXjzm.js";import"./MarkdownContent--WfXG79O.js";import"./CodeSnippet-C42Dz4me.js";import"./CopyTextButton-DE0i5KZb.js";import"./useCopyToClipboard-C2Esnc-g.js";import"./Tooltip-DdmdxGgY.js";import"./Popper-B3_-o048.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(l,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:m})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:m},m.location)},`${m.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...s.parameters?.docs?.source}}};const po=["Default","CustomModal"];export{s as CustomModal,i as Default,po as __namedExportsOrder,co as default};
