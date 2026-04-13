import{j as t,S as d,a0 as u,$ as h}from"./iframe-DgHKkkyr.js";import{r as g}from"./plugin-BoqAncLO.js";import{S as m,u as n,a as x}from"./useSearchModal-Dn_qdX3l.js";import{B as c}from"./Button-6LMQf4r6.js";import{D as S,a as f,b as M}from"./DialogTitle-WWPmSXY9.js";import{B as j}from"./Box-3aPVvtAd.js";import{S as r}from"./Grid-CynkKdtI.js";import{S as C}from"./SearchType-CcZ8-17-.js";import{L as y}from"./List-C0Su0a7g.js";import{H as I}from"./DefaultResultListItem-cAvvsSAr.js";import{w as R}from"./appWrappers-BuFNItAH.js";import{m as B}from"./makeStyles-BQ4CrWvO.js";import{s as D,M as k}from"./api-DAqxHcrV.js";import{S as v}from"./SearchContext-Baqs92uB.js";import{SearchBar as T}from"./SearchBar-xbImlPiE.js";import{S as b}from"./SearchResult-BmWQn3Oy.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DczqTtXa.js";import"./Plugin-BeWLU7St.js";import"./componentData-doRoFQ6g.js";import"./useAnalytics-By5KMxBj.js";import"./useApp-H5qXXNde.js";import"./useRouteRef-OcElKcCF.js";import"./ArrowForward-DDmV5ajd.js";import"./translation-DY600E8h.js";import"./Page-D4-b1IbA.js";import"./useMediaQuery-BYMj495N.js";import"./Divider-QqR5Bn4l.js";import"./ArrowBackIos-DYZAp0N5.js";import"./ArrowForwardIos-DHu_4Ngi.js";import"./translation-DrtHrxMQ.js";import"./Modal-5jKjo9Qs.js";import"./Portal-D2_s-m0j.js";import"./Backdrop-CT9GAALo.js";import"./styled-DQDNGh9h.js";import"./ExpandMore-DM4mnMRh.js";import"./useAsync-bUzy3WUd.js";import"./useMountedState-DgR5vj-T.js";import"./AccordionDetails-Df_MWooZ.js";import"./index-B9sM2jn7.js";import"./Collapse-OJwiGiEB.js";import"./ListItem-C3HDGAPX.js";import"./ListContext-C7Aa1vGY.js";import"./ListItemIcon-BrKJ0VWz.js";import"./ListItemText-BTZ7dHeN.js";import"./Tabs-CxO9-9Yu.js";import"./KeyboardArrowRight-H4N6ro6W.js";import"./FormLabel-CEb5odZw.js";import"./formControlState-D8ewoZYe.js";import"./InputLabel-BorLHIZx.js";import"./Select-pEv1uErY.js";import"./Popover-B9URSecK.js";import"./MenuItem-DAEdvssx.js";import"./Checkbox-BQhEBsqI.js";import"./SwitchBase-DWgRKX3U.js";import"./Chip-jxgdPn_Y.js";import"./Link-D-_ixZcQ.js";import"./index-VhduaqV-.js";import"./lodash-B6io_9QA.js";import"./WebStorage-Byksoqyk.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CIL0u7nC.js";import"./useIsomorphicLayoutEffect-BqzvsWbU.js";import"./BUIProvider-BzXDCe8S.js";import"./openLink-iVgFRcvl.js";import"./Search-BDQ16-7I.js";import"./useDebounce-Cgq7JjbE.js";import"./InputAdornment-BALykYeV.js";import"./TextField-DyNI5bh-.js";import"./useElementFilter-BqirpdjM.js";import"./EmptyState-DFlb-2zp.js";import"./Progress-Dy6KZxS-.js";import"./LinearProgress-Dzpi6Fsn.js";import"./ResponseErrorPanel-C_JVRWQO.js";import"./ErrorPanel-Dzor55_k.js";import"./WarningPanel-CGLqyY_C.js";import"./MarkdownContent-DkR80rQF.js";import"./CodeSnippet-ENxhol4h.js";import"./CopyTextButton-_dSt3mBw.js";import"./useCopyToClipboard-uYWpDaU6.js";import"./Tooltip-YbDHNNEo.js";import"./Popper-B20-UClj.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},no={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};const co=["Default","CustomModal"];export{s as CustomModal,i as Default,co as __namedExportsOrder,no as default};
