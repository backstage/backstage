import{j as t,m as d,I as u,b as h,T as g}from"./iframe-BKfEGE7G.js";import{r as x}from"./plugin-_OgSNOg9.js";import{S as m,u as n,a as S}from"./useSearchModal-DEozcjdp.js";import{B as c}from"./Button-CBt-BxVf.js";import{a as f,b as M,c as j}from"./DialogTitle-COtGSIrZ.js";import{B as C}from"./Box-BJlQ2iQy.js";import{S as r}from"./Grid-vX9qBbX0.js";import{S as y}from"./SearchType-8kMoM0Z_.js";import{L as I}from"./List-xqk2zBI-.js";import{H as R}from"./DefaultResultListItem-D8Z1xio_.js";import{s as B,M as D}from"./api-DhH7lEZ9.js";import{S as T}from"./SearchContext-DpwNQLEm.js";import{w as k}from"./appWrappers-BhL0UeRU.js";import{SearchBar as v}from"./SearchBar-wWCCvIgP.js";import{a as b}from"./SearchResult-CMTYr6ir.js";import"./preload-helper-D9Z9MdNV.js";import"./index-Dwj1Q-YF.js";import"./Plugin-CmKCshsM.js";import"./componentData-MugjuQjt.js";import"./useAnalytics-BLOfhO-l.js";import"./useApp-_11zMdcF.js";import"./useRouteRef-B__3vLRT.js";import"./index-DxVjIFhW.js";import"./ArrowForward-BWmuSl5e.js";import"./translation-Cc2do1Tm.js";import"./Page-D_c3Yzdb.js";import"./useMediaQuery-DTZzhyji.js";import"./Divider-B7pMmKOl.js";import"./ArrowBackIos-CLSmgCGM.js";import"./ArrowForwardIos-B4aeFJEt.js";import"./translation-BQdf6hBy.js";import"./Modal-CvEZPVbb.js";import"./Portal-Dl4iECMi.js";import"./Backdrop-TvGNQn7O.js";import"./styled-B4-rL4TL.js";import"./ExpandMore-Bf4tz0ks.js";import"./useAsync-DF0QzlTM.js";import"./useMountedState-Bzk_h1H1.js";import"./AccordionDetails-DO5qN2es.js";import"./index-DnL3XN75.js";import"./Collapse-Bj6_bX8n.js";import"./ListItem-DH54cTxL.js";import"./ListContext-1tRnwUCo.js";import"./ListItemIcon-CGMSEMC9.js";import"./ListItemText-DfnmZGrz.js";import"./Tabs-BTlYueFk.js";import"./KeyboardArrowRight-DoJadC5j.js";import"./FormLabel-rWNDR_CN.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DkGOq8F2.js";import"./InputLabel-Cewi00W0.js";import"./Select-HjZKhiCT.js";import"./Popover-BDMv4xbF.js";import"./MenuItem-DU6GWwGa.js";import"./Checkbox-CgKQJ5Kl.js";import"./SwitchBase-B153thNd.js";import"./Chip-BCkfe9Oa.js";import"./Link-CDMP9pev.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-1flBwXTR.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-niI_9iNc.js";import"./useDebounce-Eu5ZqlOa.js";import"./InputAdornment-BnRACK9W.js";import"./TextField-GrIBMvZl.js";import"./useElementFilter-Demb5eSc.js";import"./EmptyState-DmQUiEaR.js";import"./Progress-CXYpQq4U.js";import"./LinearProgress-ONnmqoew.js";import"./ResponseErrorPanel-C380S22U.js";import"./ErrorPanel-D0Z-D0YB.js";import"./WarningPanel-BmLRnDjl.js";import"./MarkdownContent-BbcMZHtE.js";import"./CodeSnippet-4N0YB7qg.js";import"./CopyTextButton-_rHychZO.js";import"./useCopyToClipboard-By-88AN1.js";import"./Tooltip-BkpGifwK.js";import"./Popper-Cl6P73dl.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},io={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...i.parameters?.docs?.source}}};const ao=["Default","CustomModal"];export{i as CustomModal,s as Default,ao as __namedExportsOrder,io as default};
