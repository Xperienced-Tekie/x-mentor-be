import { Module } from '@nestjs/common';
import { GitHubService } from './github.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [GitHubService],
  exports: [GitHubService],
})
export class GitHubModule {}
