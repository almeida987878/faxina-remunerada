<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the video page in the index route with a shared top bar and an adaptive video/comments grid, so the existing video and offer behavior remain together.
- Build purchase destinations with the shared campaign-parameter helper and read the page URL only after hydration, so both purchase buttons retain campaign attribution without SSR mismatches or forwarding unrelated visitor data.
