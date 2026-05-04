import{j as t,W as d,a3 as u,a2 as h}from"./iframe-COJz9F1o.js";import{r as g}from"./plugin-TVL7FdVo.js";import{S as l,u as n,a as x}from"./useSearchModal-Cy2zJOq_.js";import{B as c}from"./Button-BHosKEx7.js";import{D as S,a as f,b as M}from"./DialogTitle-BaMyW-7J.js";import{B as j}from"./Box-Dnr7lIgc.js";import{S as r}from"./Grid-QH0IRglv.js";import{S as C}from"./SearchType-CFeS6FA3.js";import{L as y}from"./List-DxjCJy_8.js";import{H as I}from"./DefaultResultListItem-DzPtBygf.js";import{w as R}from"./appWrappers-BIS3OGld.js";import{m as B}from"./makeStyles-DfpJxphG.js";import{s as D,M as k}from"./api-B1MnOkFf.js";import{S as v}from"./SearchContext-CURPT33y.js";import{SearchBar as T}from"./SearchBar-ChrnTeeR.js";import{S as b}from"./SearchResult-BAcgYSsD.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BcpCRDRA.js";import"./Plugin-Dcj7W-OT.js";import"./componentData-C7H14uU8.js";import"./useAnalytics-K4Yw9kGl.js";import"./useApp-BuWghqmQ.js";import"./useRouteRef-BUtrK1jh.js";import"./ArrowForward-CzyFZdH2.js";import"./translation-Mzvdq05f.js";import"./Page-D7N_dMpO.js";import"./useMediaQuery-O5iFJJSz.js";import"./Divider-zKAuOCNJ.js";import"./ArrowBackIos-Dy1a2aqS.js";import"./ArrowForwardIos-Dmt_x_Ri.js";import"./translation-BzNMvpns.js";import"./Modal-C4q2dohw.js";import"./Portal-Df_bDRFp.js";import"./Backdrop--lW5NYU-.js";import"./styled-CHgYw-aN.js";import"./ExpandMore-DXunSdYg.js";import"./useAsync-BWf0vs4p.js";import"./useMountedState-C3abf_5z.js";import"./AccordionDetails-whFAo4IX.js";import"./index-B9sM2jn7.js";import"./Collapse-D_FlMLCQ.js";import"./ListItem-BeM9N7OL.js";import"./ListContext-D1BzRUpQ.js";import"./ListItemIcon-1nMjLRo9.js";import"./ListItemText-BjqwjiRt.js";import"./Tabs-BZ24p4cv.js";import"./KeyboardArrowRight-p9SKOiHY.js";import"./FormLabel-JqQMvLc0.js";import"./formControlState-WER4Vjx-.js";import"./InputLabel-BZLviDoN.js";import"./Select-Cl0mbIG0.js";import"./Popover-C_zNppFz.js";import"./MenuItem-5VkYZ9CG.js";import"./Checkbox-GKSIBANN.js";import"./SwitchBase-B8sTL1a5.js";import"./Chip-DLdsXdy8.js";import"./Link-SgQWsjcg.js";import"./index-DiZHcWFF.js";import"./lodash-CDGQ6Log.js";import"./WebStorage-DYhUnu7N.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DQ5K85rR.js";import"./useIsomorphicLayoutEffect-CYLeXINS.js";import"./BUIProvider-DOZKrXfq.js";import"./openLink-D-7XJ3Oc.js";import"./useResolvedHref-B3FbQOe8.js";import"./Search-Cuq6gIcn.js";import"./useDebounce-B2uzmrhm.js";import"./InputAdornment-BrKI8Yaq.js";import"./TextField-uq-SJFq3.js";import"./useElementFilter-D1K5KrSC.js";import"./EmptyState-B3IkdtEx.js";import"./Progress-fLrZYSfj.js";import"./LinearProgress-DjDGdEvh.js";import"./ResponseErrorPanel-D4hirswD.js";import"./ErrorPanel-YGyA9VEC.js";import"./WarningPanel-WsMFaOZw.js";import"./MarkdownContent-XYn3I-kg.js";import"./CodeSnippet-DGfpD5_2.js";import"./CopyTextButton-CNIHQblK.js";import"./useCopyToClipboard-Dz7fum6I.js";import"./Tooltip-fO89vQyA.js";import"./Popper-CxR6N-KO.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(l,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:m})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:m},m.location)},`${m.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
